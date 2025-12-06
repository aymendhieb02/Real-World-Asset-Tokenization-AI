"use client";

import { useQuery } from "@tanstack/react-query";
import { searchListings, convertListingToMapData } from "@/lib/api/repliers";
import WorldMap from "@/components/ui/world-map";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PropertiesMapPage() {
  const [city, setCity] = useState("Los Angeles");
  const [state, setState] = useState("CA");
  const [searchCity, setSearchCity] = useState("Los Angeles");
  const [searchState, setSearchState] = useState("CA");

  const { data: listingsData, isLoading } = useQuery({
    queryKey: ["repliers-listings-map", searchCity, searchState],
    queryFn: () =>
      searchListings({
        city: searchCity,
        state: searchState,
        limit: 20,
      }),
    enabled: !!searchCity && !!searchState,
  });

  const listings = listingsData?.listings || [];
  const saleListings = listings.filter((l) => l.listingType === "sale" || l.listPrice).slice(0, 10);
  const rentalListings = listings.filter((l) => l.listingType === "rental" || l.rentPrice).slice(0, 10);

  // Convert listings to map dots
  const mapDots = convertListingToMapData(listings.slice(0, 10));

  const handleSearch = () => {
    setSearchCity(city);
    setSearchState(state);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Property Map</h1>
          <p className="text-foreground/70 mb-6">
            Explore real estate properties from Repliers MLS® data on an interactive world map
          </p>

          <div className="flex gap-4 mb-6">
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
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Properties Map - {searchCity}, {searchState}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <Skeleton className="h-[600px] w-full" />
                ) : (
                  <WorldMap dots={mapDots} lineColor="#00f6ff" />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Sale Listings ({saleListings?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {saleListings && saleListings.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {saleListings.slice(0, 5).map((listing) => (
                      <Link key={listing.id} href={`/properties/listings/${listing.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                        >
                          <p className="font-semibold text-sm">
                            {listing.address.street || "Address not available"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {listing.address.city}, {listing.address.state}
                          </p>
                          {listing.listPrice && (
                            <p className="text-sm text-neon-cyan mt-1">
                              ${listing.listPrice.toLocaleString()}
                            </p>
                          )}
                          {listing.property?.bedrooms && listing.property?.bathrooms && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {listing.property.bedrooms} bed, {listing.property.bathrooms} bath
                            </p>
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No sale listings found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Rental Listings ({rentalListings?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rentalListings && rentalListings.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {rentalListings.slice(0, 5).map((listing) => (
                      <Link key={listing.id} href={`/properties/listings/${listing.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                        >
                          <p className="font-semibold text-sm">
                            {listing.address.street || "Address not available"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {listing.address.city}, {listing.address.state}
                          </p>
                          {listing.rentPrice && (
                            <p className="text-sm text-neon-cyan mt-1">
                              ${listing.rentPrice.toLocaleString()}/mo
                            </p>
                          )}
                          {listing.property?.bedrooms && listing.property?.bathrooms && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {listing.property.bedrooms} bed, {listing.property.bathrooms} bath
                            </p>
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No rental listings found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {listings && listings.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Properties Found ({listings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.slice(0, 9).map((listing) => (
                  <Link key={listing.id} href={`/properties/listings/${listing.id}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-lg border bg-card hover:border-neon-cyan/50 transition-colors cursor-pointer"
                    >
                      <p className="font-semibold">
                        {listing.address.street || "Address not available"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.address.city}, {listing.address.state} {listing.address.zip}
                      </p>
                      {listing.property?.bedrooms && listing.property?.bathrooms && (
                        <p className="text-sm mt-2">
                          {listing.property.bedrooms} bed, {listing.property.bathrooms} bath
                        </p>
                      )}
                      {listing.property?.squareFeet && (
                        <p className="text-sm text-muted-foreground">
                          {listing.property.squareFeet.toLocaleString()} sq ft
                        </p>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

