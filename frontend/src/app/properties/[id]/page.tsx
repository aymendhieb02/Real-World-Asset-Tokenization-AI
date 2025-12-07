"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getPropertyById } from "@/lib/api/mock-properties";
import { PropertyDetailsTabs } from "@/components/property/property-details-tabs";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => getPropertyById(propertyId),
  });

  // Simple mock valuation
  const valuation = property ? {
    value: property.pricePerToken ? property.pricePerToken * (property.totalTokens || 1) : 500000,
    confidence: 85,
    riskScore: 35,
    marketTrend: "up" as const,
    factors: ["Prime location", "Strong rental demand", "Growing neighborhood"],
    predictedValue6Months: property.pricePerToken ? property.pricePerToken * (property.totalTokens || 1) * 1.05 : 525000,
    predictedValue12Months: property.pricePerToken ? property.pricePerToken * (property.totalTokens || 1) * 1.1 : 550000,
  } : null;

  if (propertyLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!property || !valuation) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Property not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src={property.images[0] || "/placeholder-property.jpg"}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
          <p className="text-xl text-foreground/70">
            {property.address}, {property.city}, {property.state}
          </p>
        </div>

        <PropertyDetailsTabs property={property} valuation={valuation} />
      </div>
    </MainLayout>
  );
}

