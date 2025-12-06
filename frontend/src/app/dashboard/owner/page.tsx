"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Plus, Building2, TrendingUp } from "lucide-react";

export default function OwnerDashboard() {
  // Mock data
  const ownedProperties = [
    { id: "1", name: "Miami Beach Condo", value: 550000, revenue: 5500 },
    { id: "2", name: "Seattle Office", value: 2500000, revenue: 20000 },
  ];

  const totalRevenue = ownedProperties.reduce((sum, p) => sum + p.revenue, 0);
  const totalValue = ownedProperties.reduce((sum, p) => sum + p.value, 0);

  return (
    <MainLayout showSidebar role="owner">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Owner Dashboard</h1>
          <Button variant="neon">
            <Plus size={20} className="mr-2" />
            Add Property
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ownedProperties.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-cyan">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Properties */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownedProperties.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Value</span>
                    <span className="font-semibold">{formatCurrency(property.value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Monthly Revenue</span>
                    <span className="font-semibold text-green-400">{formatCurrency(property.revenue)}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Manage Property
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

