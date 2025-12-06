"use client";

import { useQuery } from "@tanstack/react-query";
import { getListingById, getSimilarListings } from "@/lib/api/repliers";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { MapPin, Bed, Bath, Square, Calendar, DollarSign, Home, Building2, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ListingDetailsPage() {
  const params = useParams();
  const listingId = params.id as string;

  const { data: listing, isLoading } = useQuery({
    queryKey: ["repliers-listing", listingId],
    queryFn: () => getListingById(listingId),
    enabled: !!listingId,
  });

  const { data: similarListings } = useQuery({
    queryKey: ["repliers-similar-listings", listingId],
    queryFn: () => getSimilarListings(listingId, 6),
    enabled: !!listingId && !!listing,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!listing) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Listing not found</p>
              <Link href="/properties/listings">
                <Button className="mt-4">Back to Listings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/properties/listings">
            <Button variant="ghost" className="mb-4">← Back to Listings</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">
                  {listing.address.street || "Address not available"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {listing.address.city}, {listing.address.state} {listing.address.zip}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Photos */}
                {listing.photos && listing.photos.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      {listing.photos.slice(0, 4).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  {listing.listPrice && (
                    <p className="text-4xl font-bold text-neon-cyan">
                      ${listing.listPrice.toLocaleString()}
                    </p>
                  )}
                  {listing.rentPrice && (
                    <p className="text-4xl font-bold text-neon-cyan">
                      ${listing.rentPrice.toLocaleString()}/mo
                    </p>
                  )}
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {listing.property?.bedrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-neon-cyan" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-semibold">{listing.property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {listing.property?.bathrooms !== undefined && (
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-neon-cyan" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-semibold">{listing.property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {listing.property?.squareFeet && (
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-neon-cyan" />
                      <div>
                        <p className="text-sm text-muted-foreground">Square Feet</p>
                        <p className="font-semibold">{listing.property.squareFeet.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {listing.property?.yearBuilt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-neon-cyan" />
                      <div>
                        <p className="text-sm text-muted-foreground">Year Built</p>
                        <p className="font-semibold">{listing.property.yearBuilt}</p>
                      </div>
                    </div>
                  )}
                </div>

                {listing.property?.lotSize && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-semibold">{listing.property.lotSize.toLocaleString()} sq ft</p>
                  </div>
                )}

                {listing.property?.type && (
                  <div className="mt-4">
                    <span className="px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-sm">
                      {listing.property.type}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {listing.property?.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 whitespace-pre-wrap">
                    {listing.property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Similar Listings */}
            {similarListings && similarListings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarListings.map((similar) => (
                      <Link key={similar.id} href={`/properties/listings/${similar.id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg border bg-card hover:border-neon-cyan/50 transition-colors cursor-pointer"
                        >
                          <p className="font-semibold">{similar.address.street || "Address not available"}</p>
                          <p className="text-sm text-muted-foreground">
                            {similar.address.city}, {similar.address.state}
                          </p>
                          {similar.listPrice && (
                            <p className="text-lg font-bold text-neon-cyan mt-2">
                              ${similar.listPrice.toLocaleString()}
                            </p>
                          )}
                          {similar.rentPrice && (
                            <p className="text-lg font-bold text-neon-cyan mt-2">
                              ${similar.rentPrice.toLocaleString()}/mo
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

          <div className="space-y-6">
            {/* Agent Info */}
            {listing.agent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Agent Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.agent.name && (
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold">{listing.agent.name}</p>
                      </div>
                    )}
                    {listing.agent.email && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </p>
                        <a
                          href={`mailto:${listing.agent.email}`}
                          className="text-neon-cyan hover:underline"
                        >
                          {listing.agent.email}
                        </a>
                      </div>
                    )}
                    {listing.agent.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone
                        </p>
                        <a
                          href={`tel:${listing.agent.phone}`}
                          className="text-neon-cyan hover:underline"
                        >
                          {listing.agent.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Office Info */}
            {listing.office && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Office
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {listing.office.name && (
                    <p className="font-semibold">{listing.office.name}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Location Info */}
            {listing.location?.latitude && listing.location?.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Coordinates</p>
                  <p className="font-mono text-sm">
                    {listing.location.latitude.toFixed(6)}, {listing.location.longitude.toFixed(6)}
                  </p>
                  <Link
                    href={`https://www.google.com/maps?q=${listing.location.latitude},${listing.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full mt-4">
                      View on Google Maps
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Listing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.mlsNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">MLS Number</span>
                    <span className="font-semibold">{listing.mlsNumber}</span>
                  </div>
                )}
                {listing.status && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold">{listing.status}</span>
                  </div>
                )}
                {listing.listingDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Listed</span>
                    <span className="font-semibold">
                      {new Date(listing.listingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {listing.lastModified && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-semibold">
                      {new Date(listing.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

