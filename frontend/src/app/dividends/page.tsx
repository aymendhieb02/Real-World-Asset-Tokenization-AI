"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default function DividendsPage() {
  // Mock dividends
  const dividends = [
    { id: "1", propertyId: "1", propertyName: "Miami Beach Condo", amount: 125.50, perToken: 0.10, date: "2024-01-15", claimable: true },
    { id: "2", propertyId: "2", propertyName: "Seattle Office", amount: 50.00, perToken: 0.10, date: "2024-01-10", claimable: false, claimed: true },
  ];

  const totalClaimable = dividends.filter((d) => d.claimable).reduce((sum, d) => sum + d.amount, 0);

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dividends</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Claimable Dividends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-4">{formatCurrency(totalClaimable)}</div>
            <Button variant="neon" disabled={totalClaimable === 0}>
              Claim All Dividends
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dividend History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dividends.map((dividend) => (
                <div key={dividend.id} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div>
                    <div className="font-semibold">{dividend.propertyName}</div>
                    <div className="text-sm text-foreground/60">{formatDate(dividend.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(dividend.amount)}</div>
                    {dividend.claimable ? (
                      <Button size="sm" variant="outline" className="mt-2">
                        Claim
                      </Button>
                    ) : (
                      <div className="text-xs text-foreground/60 mt-2">Claimed</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

