"use client";

import { Property, AIValuation } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyTokenForm } from "./buy-token-form";
import { APYCalculator } from "./apy-calculator";
import { InvestmentSimulation } from "./investment-simulation";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Bed, Bath, Square, Calendar, Building2 } from "lucide-react";

interface PropertyDetailsTabsProps {
  property: Property;
  valuation: AIValuation;
}

export function PropertyDetailsTabs({ property, valuation }: PropertyDetailsTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="tokenomics">Tokenomics</TabsTrigger>
        <TabsTrigger value="invest">Invest</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-foreground/60" />
                  <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center space-x-2">
                    <Bed size={16} className="text-foreground/60" />
                    <span className="text-sm">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center space-x-2">
                    <Bath size={16} className="text-foreground/60" />
                    <span className="text-sm">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.squareFeet && (
                  <div className="flex items-center space-x-2">
                    <Square size={16} className="text-foreground/60" />
                    <span className="text-sm">{property.squareFeet.toLocaleString()} sqft</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-foreground/60" />
                    <span className="text-sm">Built in {property.yearBuilt}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Building2 size={16} className="text-foreground/60" />
                  <span className="text-sm capitalize">{property.propertyType}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-foreground/70">{property.description}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tokenomics" className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Token Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Total Tokens</div>
                  <div className="text-xl font-bold">{property.totalTokens?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Available Tokens</div>
                  <div className="text-xl font-bold">{property.tokensAvailable?.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Price per Token</div>
                  <div className="text-xl font-bold">{formatCurrency(property.pricePerToken || 1)}</div>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">APY</div>
                  <div className="text-xl font-bold text-green-400">{property.apy?.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {property.tokenAddress && (
              <div>
                <div className="text-sm text-foreground/60 mb-1">Token Contract</div>
                <div className="text-sm font-mono break-all">{property.tokenAddress}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <APYCalculator apy={property.apy || 0} />
          <InvestmentSimulation apy={property.apy || 0} initialPrice={property.pricePerToken || 1} />
        </div>
      </TabsContent>

      <TabsContent value="invest" className="space-y-4">
        <BuyTokenForm
          propertyId={property.id}
          pricePerToken={property.pricePerToken || 1}
          tokensAvailable={property.tokensAvailable || 0}
        />
      </TabsContent>
    </Tabs>
  );
}

