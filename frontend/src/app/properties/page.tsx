"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/lib/api/mock-properties";
import { PropertyCard } from "@/components/property/property-card";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  const filteredProperties = properties?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Properties</h1>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Link href="/properties/listings">
              <Button variant="outline">View MLS Listings</Button>
            </Link>
            <Link href="/properties/map">
              <Button variant="outline">View on Map</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

