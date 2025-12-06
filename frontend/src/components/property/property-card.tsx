"use client";

import { Property } from "@/types";
import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { MapPin, Bed, Bath, Square, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <GlassmorphismCard className="overflow-hidden h-full cursor-pointer">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={property.images[0] || "/placeholder-property.jpg"}
              alt={property.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="neon">{formatPercentage(property.apy || 0)} APY</Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
              <div className="flex items-center text-sm text-foreground/60">
                <MapPin size={14} className="mr-1" />
                {property.city}, {property.state}
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center space-x-4 text-sm text-foreground/70">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed size={16} className="mr-1" />
                  {property.bedrooms}
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath size={16} className="mr-1" />
                  {property.bathrooms}
                </div>
              )}
              {property.squareFeet && (
                <div className="flex items-center">
                  <Square size={16} className="mr-1" />
                  {property.squareFeet.toLocaleString()} sqft
                </div>
              )}
            </div>

            {/* Valuation */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-foreground/60">AI Valuation</div>
                  <div className="text-xl font-bold text-neon-cyan">
                    {formatCurrency(property.totalTokens ? property.totalTokens * (property.pricePerToken || 1) : 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-foreground/60">Price/Token</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(property.pricePerToken || 1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            {property.tokensAvailable && property.totalTokens && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground/60">Available</span>
                  <span className="font-semibold">
                    {((property.tokensAvailable / property.totalTokens) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full"
                    style={{ width: `${(property.tokensAvailable / property.totalTokens) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </GlassmorphismCard>
      </motion.div>
    </Link>
  );
}

