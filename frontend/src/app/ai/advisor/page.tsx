"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getInvestmentRecommendations,
  getAdvisorStates,
  getAdvisorCities,
  type AdvisorRequest,
  type AdvisorRecommendation,
} from "@/lib/api/ml-models";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Home, MapPin, DollarSign, AlertCircle, Loader2 } from "lucide-react";

export default function InvestmentAdvisorPage() {
  const [formData, setFormData] = useState<AdvisorRequest>({
    budget: 500000,
    state: "",
    city: "",
    min_beds: 2,
    min_baths: 1,
    top_n: 10,
  });

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const { data: recommendations, refetch, error: queryError } = useQuery({
    queryKey: ["investment-recommendations", formData],
    queryFn: () => {
      console.log("[Advisor] Fetching recommendations with:", formData);
      return getInvestmentRecommendations(formData);
    },
    enabled: false,
    retry: false,
  });

  const handleSearch = async () => {
    setError(null);
    setIsSearching(true);
    try {
      await refetch();
    } catch (err) {
      console.error("[Advisor] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch recommendations");
    } finally {
      setIsSearching(false);
    }
  };

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const result = await getAdvisorStates();
        if (result.success && result.states) {
          setStates(result.states.sort());
          console.log("[Advisor] Loaded states:", result.states.length);
        }
      } catch (err) {
        console.error("[Advisor] Error loading states:", err);
        // Don't show error, just log it
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      setFormData(prev => ({ ...prev, city: "" })); // Clear city when state is cleared
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const result = await getAdvisorCities(formData.state);
        if (result.success && result.cities) {
          const sortedCities = result.cities.sort();
          setCities(sortedCities);
          console.log("[Advisor] Loaded cities for", formData.state, ":", sortedCities.length);
          // Clear city if it's not in the new list
          if (formData.city && !sortedCities.includes(formData.city)) {
            setFormData(prev => ({ ...prev, city: "" }));
          }
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("[Advisor] Error loading cities:", err);
        setCities([]);
        // Don't clear the city on error, just log it
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [formData.state]); // Only depend on state, not city

  // Log recommendations when loaded
  useEffect(() => {
    if (recommendations) {
      console.log("[Advisor] Recommendations loaded:", recommendations.data?.length || 0, "properties");
    }
  }, [recommendations]);

  const getRiskColor = (risk: number) => {
    if (risk < 30) return "text-green-400";
    if (risk < 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 30) return "Low";
    if (risk < 60) return "Medium";
    return "High";
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            AI Investment Advisor
          </h1>
          <p className="text-foreground/70">
            Get personalized property investment recommendations based on your budget and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign size={20} />
                <span>Search Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Budget (USD)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">State (Optional)</label>
                <Select
                  value={formData.state || "all"}
                  onValueChange={(value) => {
                    const newState = value === "all" ? "" : value;
                    setFormData({ ...formData, state: newState, city: "" }); // Clear city when state changes
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
                {!formData.state ? (
                  <div className="w-full px-3 py-2 bg-background/50 border border-input rounded-md text-sm text-foreground/50 cursor-not-allowed">
                    Select a state first
                  </div>
                ) : (
                  <Select
                    value={formData.city || "all"}
                    onValueChange={(value) => {
                      const newCity = value === "all" ? "" : value;
                      setFormData({ ...formData, city: newCity });
                    }}
                    disabled={loadingCities}
                  >
                    <SelectTrigger>
                      <SelectValue 
                        placeholder={
                          loadingCities 
                            ? "Loading cities..." 
                            : cities.length === 0
                            ? "No cities available"
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
                )}
                {formData.state && loadingCities && (
                  <p className="text-xs text-foreground/50 mt-1 flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading cities...</span>
                  </p>
                )}
                {formData.state && !loadingCities && cities.length === 0 && (
                  <p className="text-xs text-foreground/50 mt-1">No cities available for this state</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Bedrooms</label>
                <Input
                  type="number"
                  value={formData.min_beds}
                  onChange={(e) =>
                    setFormData({ ...formData, min_beds: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Min Bathrooms</label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.min_baths}
                  onChange={(e) =>
                    setFormData({ ...formData, min_baths: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Number of Results</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.top_n}
                  onChange={(e) =>
                    setFormData({ ...formData, top_n: parseInt(e.target.value) || 10 })
                  }
                />
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching || formData.budget <= 0}
                className="w-full"
                variant="neon"
              >
                {isSearching ? "Searching..." : "🔍 Find Investments"}
              </Button>

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
          <div className="lg:col-span-3">
            {recommendations?.success && (
              <div className="mb-4">
                <Card className="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-foreground/60">Properties Analyzed</div>
                        <div className="text-2xl font-bold text-neon-cyan">
                          {recommendations.total_analyzed.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-foreground/60">Recommendations Found</div>
                        <div className="text-2xl font-bold text-purple-400">
                          {recommendations.data.length}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {recommendations?.data && recommendations.data.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Top Investment Opportunities</h2>
                {recommendations.data.map((prop: AdvisorRecommendation, index: number) => (
                  <Card key={index} className="glass hover:border-neon-cyan/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl font-bold text-neon-cyan">#{index + 1}</span>
                            <div>
                              <div className="flex items-center space-x-2">
                                <MapPin size={16} className="text-foreground/60" />
                                <span className="font-semibold">
                                  {prop.city}, {prop.state}
                                </span>
                              </div>
                              <div className="text-sm text-foreground/60">
                                {prop.beds} bed, {prop.baths} bath • {prop.house_size.toLocaleString()} sqft
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-foreground/60 mb-1">Current Price</div>
                          <div className="text-xl font-bold text-neon-cyan">
                            {formatCurrency(prop.current_price)}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-foreground/60 mb-1">10-Year ROI</div>
                          <div className="text-xl font-bold text-green-400 flex items-center space-x-1">
                            <TrendingUp size={18} />
                            <span>{prop.roi_10_year.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                        <div>
                          <div className="text-sm text-foreground/60 mb-1">Projected (10yr)</div>
                          <div className="font-semibold">
                            {formatCurrency(prop.price_10yr)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-foreground/60 mb-1">Potential Gain</div>
                          <div className="font-semibold text-green-400">
                            {formatCurrency(prop.price_10yr - prop.current_price)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-foreground/60 mb-1">Risk Level</div>
                          <div className={`font-semibold ${getRiskColor(prop.risk * 100)}`}>
                            {getRiskLabel(prop.risk * 100)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-foreground/60 mb-1">Risk Score</div>
                          <div className="font-semibold">
                            {(prop.risk * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  {error || queryError ? (
                    <div className="space-y-2">
                      <div className="text-red-400 font-semibold">Error Loading Recommendations</div>
                      <div className="text-sm text-foreground/60 mb-2">
                        {error || (queryError instanceof Error ? queryError.message : "Unknown error")}
                      </div>
                      <div className="text-xs text-foreground/50 space-y-1">
                        <div>Make sure the unified ML API backend is running:</div>
                        <code className="block bg-black/30 p-2 rounded mt-1">cd ml-api && python main.py</code>
                        <div className="mt-2">Or check the API URL: {process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5001"}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-foreground/50">
                      {recommendations?.success === false
                        ? "No properties found matching your criteria. Try adjusting your search."
                        : "Enter your investment criteria and click 'Find Investments' to see recommendations"}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

