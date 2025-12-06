"use client";

import { useQuery } from "@tanstack/react-query";
import { searchListings, getMarketStatistics } from "@/lib/api/repliers";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home, Building2, TrendingUp, DollarSign, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ListingsPage() {
  const [city, setCity] = useState("Los Angeles");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("");
  const [searchCity, setSearchCity] = useState("Los Angeles");
  const [searchState, setSearchState] = useState("CA");
  const [searchZipCode, setSearchZipCode] = useState("");
  const [listingType, setListingType] = useState<"sale" | "rental" | "all">("all");

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ["repliers-listings", searchCity, searchState, searchZipCode, listingType],
    queryFn: () =>
      searchListings({
        city: searchCity,
        state: searchState,
        zipCode: searchZipCode || undefined,
        listingType: listingType === "all" ? undefined : listingType,
        limit: 50,
      }),
    enabled: !!searchCity && !!searchState,
  });

  const { data: marketStats } = useQuery({
    queryKey: ["repliers-market-stats", searchCity, searchState, searchZipCode],
    queryFn: () =>
      getMarketStatistics({
        city: searchCity,
        state: searchState,
        zipCode: searchZipCode || undefined,
      }),
    enabled: !!searchCity && !!searchState,
  });

  const listings = listingsData?.listings || [];
  const saleListings = listings.filter((l) => l.listingType === "sale" || l.listPrice);
  const rentalListings = listings.filter((l) => l.listingType === "rental" || l.rentPrice);

  const handleSearch = () => {
    setSearchCity(city);
    setSearchState(state);
    setSearchZipCode(zipCode);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Property Listings</h1>
          <p className="text-foreground/70 mb-6">
            Browse real estate listings from Repliers MLS® data
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="max-w-xs"
            />
            <Input
              placeholder="State (e.g., CA)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="max-w-xs"
            />
            <Input
              placeholder="Zip Code (optional)"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as "sale" | "rental" | "all")}
              className="px-4 py-2 rounded-lg border bg-card text-foreground"
            >
              <option value="all">All Listings</option>
              <option value="sale">For Sale</option>
              <option value="rental">For Rent</option>
            </select>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Link href="/properties/map">
              <Button variant="outline">View on Map</Button>
            </Link>
          </div>
        </div>

        {/* Market Statistics */}
        {marketStats && Object.keys(marketStats).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {marketStats.averagePrice && (
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Price</CardDescription>
                  <CardTitle className="text-2xl">
                    ${marketStats.averagePrice.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
            )}
            {marketStats.averageRent && (
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Rent</CardDescription>
                  <CardTitle className="text-2xl">
                    ${marketStats.averageRent.toLocaleString()}/mo
                  </CardTitle>
                </CardHeader>
              </Card>
            )}
            {marketStats.pricePerSquareFoot && (
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Price per Sq Ft</CardDescription>
                  <CardTitle className="text-2xl">
                    ${marketStats.pricePerSquareFoot.toFixed(2)}
                  </CardTitle>
                </CardHeader>
              </Card>
            )}
            {marketStats.totalListings && (
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Listings</CardDescription>
                  <CardTitle className="text-2xl">{marketStats.totalListings}</CardTitle>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sale Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Sale Listings ({saleListings.length})
              </CardTitle>
              <CardDescription>
                Properties available for purchase in {searchCity}, {searchState}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : saleListings.length > 0 ? (
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {saleListings.map((listing) => (
                    <Link key={listing.id} href={`/properties/listings/${listing.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border bg-card hover:border-neon-cyan/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-lg">
                              {listing.address.street || "Address not available"}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {listing.address.city}, {listing.address.state} {listing.address.zip}
                            </p>
                            {listing.listPrice && (
                              <p className="text-xl font-bold text-neon-cyan mt-2">
                                ${listing.listPrice.toLocaleString()}
                              </p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              {listing.property?.bedrooms && (
                                <span>{listing.property.bedrooms} bed</span>
                              )}
                              {listing.property?.bathrooms && (
                                <span>{listing.property.bathrooms} bath</span>
                              )}
                              {listing.property?.squareFeet && (
                                <span>{listing.property.squareFeet.toLocaleString()} sq ft</span>
                              )}
                            </div>
                          </div>
                          {listing.photos && listing.photos.length > 0 && (
                            <img
                              src={listing.photos[0]}
                              alt={listing.address.street || "Property"}
                              className="w-24 h-24 object-cover rounded-lg ml-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No sale listings found</p>
              )}
            </CardContent>
          </Card>

          {/* Rental Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Rental Listings ({rentalListings.length})
              </CardTitle>
              <CardDescription>
                Properties available for rent in {searchCity}, {searchState}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : rentalListings.length > 0 ? (
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {rentalListings.map((listing) => (
                    <Link key={listing.id} href={`/properties/listings/${listing.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border bg-card hover:border-neon-cyan/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-lg">
                              {listing.address.street || "Address not available"}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {listing.address.city}, {listing.address.state} {listing.address.zip}
                            </p>
                            {listing.rentPrice && (
                              <p className="text-xl font-bold text-neon-cyan mt-2">
                                ${listing.rentPrice.toLocaleString()}/mo
                              </p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              {listing.property?.bedrooms && (
                                <span>{listing.property.bedrooms} bed</span>
                              )}
                              {listing.property?.bathrooms && (
                                <span>{listing.property.bathrooms} bath</span>
                              )}
                              {listing.property?.squareFeet && (
                                <span>{listing.property.squareFeet.toLocaleString()} sq ft</span>
                              )}
                            </div>
                          </div>
                          {listing.photos && listing.photos.length > 0 && (
                            <img
                              src={listing.photos[0]}
                              alt={listing.address.street || "Property"}
                              className="w-24 h-24 object-cover rounded-lg ml-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No rental listings found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

