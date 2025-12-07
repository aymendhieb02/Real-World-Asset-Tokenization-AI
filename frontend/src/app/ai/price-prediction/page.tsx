"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predictPrice, forecastPrices, getZipCodeStats, getAdvisorStates, getAdvisorCities, type ForecastRequest } from "@/lib/api/ml-models";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Home, MapPin, AlertCircle, Loader2 } from "lucide-react";

export default function PricePredictionPage() {
  const [formData, setFormData] = useState({
    house_size: 2000,
    bed: 3,
    bath: 2,
    acre_lot: 0.25,
    zip_code: 0, // Will be set from dropdown
    sold_year: 2024, // Hidden, default to 2024
    // Additional fields for model (auto-calculated from zip code)
    city_size: 5000,
    zip_price_mean: 0,
    zip_price_median: 0,
    zip_size_mean: 0,
    zip_count: 0,
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCodeError, setZipCodeError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const result = await getAdvisorStates();
        if (result.success && result.states) {
          setStates(result.states.sort());
        }
      } catch (err) {
        console.error("[Price Prediction] Error loading states:", err);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const result = await getAdvisorCities(selectedState);
        if (result.success && result.cities) {
          setCities(result.cities.sort());
          // Clear city if it's not in the new list
          if (selectedCity && !result.cities.includes(selectedCity)) {
            setSelectedCity("");
          }
        }
      } catch (err) {
        console.error("[Price Prediction] Error loading cities:", err);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedState, selectedCity]);

  // Fetch zip code statistics when zip code changes (with debounce)
  const { data: zipStatsData, isLoading: isLoadingZipStats, error: zipStatsError } = useQuery({
    queryKey: ["zip-stats", formData.zip_code],
    queryFn: () => getZipCodeStats(formData.zip_code),
    enabled: formData.zip_code > 0 && formData.zip_code.toString().length === 5, // Only fetch if valid 5-digit zip
    staleTime: Infinity,
    retry: false,
  });

  // Update form data when zip stats are loaded
  useEffect(() => {
    if (zipStatsData?.success && zipStatsData.stats) {
      const stats = zipStatsData.stats;
      setFormData(prev => ({
        ...prev,
        zip_price_mean: stats.zip_price_mean || 0,
        zip_price_median: stats.zip_price_median || 0,
        zip_size_mean: stats.zip_size_mean || 0,
        zip_count: stats.property_count || 0,
      }));
      setZipCodeError(null); // Clear error if stats loaded successfully
    }
  }, [zipStatsData]);

  // Handle zip code validation errors
  useEffect(() => {
    if (zipStatsError) {
      if (zipStatsError instanceof Error) {
        if (zipStatsError.message.includes("404") || zipStatsError.message.includes("No data found")) {
          setZipCodeError("This ZIP code does not exist in our database. Please enter a valid ZIP code.");
        } else {
          setZipCodeError("Error loading ZIP code data. Please try again.");
        }
      } else {
        setZipCodeError("Invalid ZIP code. Please enter a valid 5-digit ZIP code.");
      }
    } else if (formData.zip_code > 0 && formData.zip_code.toString().length === 5 && !isLoadingZipStats && !zipStatsData) {
      // If zip code is entered but no stats loaded yet, wait a bit
      const timer = setTimeout(() => {
        if (!zipStatsData && !isLoadingZipStats) {
          setZipCodeError("ZIP code not found. Please enter a valid ZIP code.");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [zipStatsError, formData.zip_code, isLoadingZipStats, zipStatsData]);

  const { data: forecast, refetch, error: queryError } = useQuery({
    queryKey: ["price-forecast", formData],
    queryFn: async () => {
      // Calculate derived fields
      const bed = Math.max(formData.bed, 1);
      const bath = Math.max(formData.bath, 1);
      const acre_lot = Math.max(formData.acre_lot, 0.01);
      const year = formData.sold_year || 2024;
      
      const sqft_per_bed = formData.house_size / bed;
      const bed_bath_sum = bed + bath;
      const bed_bath_ratio = bed / bath;
      const lot_size_sqft = acre_lot * 43560;
      const house_to_lot_ratio = formData.house_size / lot_size_sqft;
      const years_since_2000 = year - 2000;
      const is_recent = year >= 2015 ? 1 : 0;
      const decade = Math.floor(year / 10) * 10;
      const month_sin = Math.sin(2 * Math.PI * 6 / 12);
      const month_cos = Math.cos(2 * Math.PI * 6 / 12);
      const is_large_city = formData.city_size > 1000 ? 1 : 0;
      
      // Prepare full feature set for the model
      const fullData = {
        house_size: formData.house_size,
        bed: bed,
        bath: bath,
        sqft_per_bed: sqft_per_bed,
        bed_bath_ratio: bed_bath_ratio,
        bed_bath_sum: bed_bath_sum,
        acre_lot: acre_lot,
        lot_size_sqft: lot_size_sqft,
        house_to_lot_ratio: house_to_lot_ratio,
        city_size: formData.city_size,
        is_large_city: is_large_city,
        years_since_2000: years_since_2000,
        is_recent: is_recent,
        decade: decade,
        month_sin: month_sin,
        month_cos: month_cos,
        zip_price_mean: formData.zip_price_mean || formData.house_size * 150,
        zip_price_median: formData.zip_price_median || formData.house_size * 145,
        zip_size_mean: formData.zip_size_mean || formData.house_size,
        zip_count: formData.zip_count || 100,
        zip_code: formData.zip_code,
        sold_year: year,
      };
      
      console.log("[Price Prediction] Sending data to API:", fullData);
      return await forecastPrices(fullData);
    },
    enabled: false,
    retry: false,
  });

  const handlePredict = async () => {
    setError(null);
    
    // Validate zip code
    if (!formData.zip_code || formData.zip_code.toString().length !== 5) {
      setZipCodeError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    
    if (zipCodeError) {
      setError("Please fix the ZIP code error before predicting.");
      return;
    }
    
    if (!zipStatsData?.success) {
      setZipCodeError("ZIP code not found. Please enter a valid ZIP code from our database.");
      return;
    }
    
    setIsPredicting(true);
    try {
      await refetch();
    } catch (err) {
      console.error("[Price Prediction] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to predict prices");
    } finally {
      setIsPredicting(false);
    }
  };

  const chartData = forecast?.forecast
    ? [
        {
          year: forecast.forecast.current_year,
          price: forecast.forecast.current_price,
          label: "Current",
        },
        {
          year: forecast.forecast.current_year + 1,
          price: forecast.forecast.price_1_year,
          label: "1 Year",
        },
        {
          year: forecast.forecast.current_year + 5,
          price: forecast.forecast.price_5_year,
          label: "5 Years",
        },
        {
          year: forecast.forecast.current_year + 10,
          price: forecast.forecast.price_10_year,
          label: "10 Years",
        },
      ]
    : [];

  const totalGain = forecast?.forecast
    ? forecast.forecast.price_10_year - forecast.forecast.current_price
    : 0;
  const roi = forecast?.forecast
    ? ((totalGain / forecast.forecast.current_price) * 100).toFixed(2)
    : "0";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            AI Price Prediction
          </h1>
          <p className="text-foreground/70">
            Predict current property value and forecast future prices using advanced ML models
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home size={20} />
                <span>Property Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">House Size (sqft)</label>
                <Input
                  type="number"
                  value={formData.house_size}
                  onChange={(e) =>
                    setFormData({ ...formData, house_size: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                <Input
                  type="number"
                  value={formData.bed}
                  onChange={(e) =>
                    setFormData({ ...formData, bed: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.bath}
                  onChange={(e) =>
                    setFormData({ ...formData, bath: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Lot Size (acres)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.acre_lot}
                  onChange={(e) =>
                    setFormData({ ...formData, acre_lot: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">State (Optional)</label>
                <Select
                  value={selectedState || "all"}
                  onValueChange={(value) => {
                    const newState = value === "all" ? "" : value;
                    setSelectedState(newState);
                    setSelectedCity(""); // Clear city when state changes
                  }}
                  disabled={loadingStates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingStates ? "Loading states..." : "All States"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingStates && (
                  <p className="text-xs text-foreground/50 mt-1 flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading states...</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">City (Optional)</label>
                <Select
                  value={selectedCity || "all"}
                  onValueChange={(value) => {
                    const newCity = value === "all" ? "" : value;
                    setSelectedCity(newCity);
                  }}
                  disabled={!selectedState || loadingCities}
                >
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={
                        !selectedState 
                          ? "Select a state first" 
                          : loadingCities 
                          ? "Loading cities..." 
                          : "All Cities"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedState && (
                  <p className="text-xs text-foreground/50 mt-1">Select a state first to see cities</p>
                )}
                {selectedState && loadingCities && (
                  <p className="text-xs text-foreground/50 mt-1 flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading cities...</span>
                  </p>
                )}
                {selectedState && !loadingCities && cities.length === 0 && (
                  <p className="text-xs text-foreground/50 mt-1">No cities available for this state</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>ZIP Code *</span>
                </label>
                <Input
                  type="number"
                  placeholder="Enter 5-digit ZIP code (e.g., 90210)"
                  value={formData.zip_code > 0 ? formData.zip_code : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const zip = value ? parseInt(value) : 0;
                    setFormData({ ...formData, zip_code: zip });
                    setZipCodeError(null); // Clear error when user types
                  }}
                  maxLength={5}
                  className={zipCodeError ? "border-red-500" : ""}
                />
                {isLoadingZipStats && formData.zip_code > 0 && formData.zip_code.toString().length === 5 && (
                  <p className="text-xs text-foreground/60 mt-1 flex items-center space-x-1">
                    <span className="animate-spin">⏳</span>
                    <span>Loading statistics...</span>
                  </p>
                )}
                {zipCodeError && (
                  <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{zipCodeError}</span>
                  </p>
                )}
                {zipStatsData?.success && !zipCodeError && (
                  <p className="text-xs text-green-400 mt-1">
                    ✓ {zipStatsData.stats.property_count.toLocaleString()} properties found in this ZIP
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">City Size</label>
                <Input
                  type="number"
                  value={formData.city_size}
                  onChange={(e) =>
                    setFormData({ ...formData, city_size: parseFloat(e.target.value) || 5000 })
                  }
                  placeholder="Population"
                />
              </div>

              <Button
                onClick={handlePredict}
                disabled={isPredicting || isLoadingZipStats || !!zipCodeError || !zipStatsData?.success}
                className="w-full"
                variant="neon"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Predict Prices
                  </>
                )}
              </Button>
              {(!zipStatsData?.success || zipCodeError) && formData.zip_code > 0 && (
                <p className="text-xs text-foreground/60 text-center mt-2">
                  Please enter a valid ZIP code to enable prediction
                </p>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                  Error: {error}
                </div>
              )}

              {queryError && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                  Error: {queryError instanceof Error ? queryError.message : "Unknown error"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {forecast?.forecast && (
              <>
                {/* Forecast Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass border-neon-cyan/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-foreground/60 mb-1">Current</div>
                      <div className="text-2xl font-bold text-neon-cyan">
                        {formatCurrency(forecast.forecast.current_price)}
                      </div>
                      <div className="text-xs text-foreground/50 mt-1">
                        {forecast.forecast.current_year}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-green-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-foreground/60 mb-1">1 Year</div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(forecast.forecast.price_1_year)}
                      </div>
                      <div className="text-xs text-green-400 mt-1 flex items-center justify-center">
                        <TrendingUp size={12} className="mr-1" />
                        {formatPercentage(
                          ((forecast.forecast.price_1_year - forecast.forecast.current_price) /
                            forecast.forecast.current_price) *
                            100
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-blue-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-foreground/60 mb-1">5 Years</div>
                      <div className="text-2xl font-bold text-blue-400">
                        {formatCurrency(forecast.forecast.price_5_year)}
                      </div>
                      <div className="text-xs text-blue-400 mt-1 flex items-center justify-center">
                        <TrendingUp size={12} className="mr-1" />
                        {formatPercentage(
                          ((forecast.forecast.price_5_year - forecast.forecast.current_price) /
                            forecast.forecast.current_price) *
                            100
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass border-purple-400/30">
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-foreground/60 mb-1">10 Years</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {formatCurrency(forecast.forecast.price_10_year)}
                      </div>
                      <div className="text-xs text-purple-400 mt-1 flex items-center justify-center">
                        <TrendingUp size={12} className="mr-1" />
                        {formatPercentage(
                          ((forecast.forecast.price_10_year - forecast.forecast.current_price) /
                            forecast.forecast.current_price) *
                            100
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Forecast Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis
                            dataKey="year"
                            stroke="#ffffff60"
                            style={{ fontSize: "12px" }}
                          />
                          <YAxis
                            stroke="#ffffff60"
                            style={{ fontSize: "12px" }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#00f0ff"
                            strokeWidth={3}
                            dot={{ fill: "#00f0ff", r: 6 }}
                            name="Predicted Price"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign size={20} />
                      <span>Investment Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-foreground/60 mb-1">10-Year Gain</div>
                        <div className="text-xl font-bold text-green-400">
                          {formatCurrency(totalGain)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-foreground/60 mb-1">ROI (10 Years)</div>
                        <div className="text-xl font-bold text-neon-cyan">{roi}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-foreground/60 mb-1">Annual Growth</div>
                        <div className="text-xl font-bold text-blue-400">
                          {forecast.forecast.growth_rate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-foreground/60 mb-1">Method</div>
                        <div className="text-sm font-medium text-foreground/80">
                          ML + Trends
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!forecast && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-foreground/50">
                    Enter property details and click "Predict Prices" to see forecasts
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

