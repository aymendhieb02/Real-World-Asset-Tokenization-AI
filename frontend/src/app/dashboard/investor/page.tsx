"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties } from "@/lib/api/mock-properties";
import { MainLayout } from "@/components/layout/main-layout";
import { PropertyCard } from "@/components/property/property-card";
import { TokenBalance } from "@/components/web3/token-balance";
import { PerformanceLineChart } from "@/components/charts/performance-line-chart";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

export default function InvestorDashboard() {
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  // Mock portfolio data
  const portfolioValue = 125000;
  const totalInvested = 100000;
  const totalReturn = portfolioValue - totalInvested;
  const totalReturnPercent = (totalReturn / totalInvested) * 100;

  const performanceData = [
    { date: "Jan", value: 100000, return: 0 },
    { date: "Feb", value: 105000, return: 5 },
    { date: "Mar", value: 110000, return: 10 },
    { date: "Apr", value: 115000, return: 15 },
    { date: "May", value: 120000, return: 20 },
    { date: "Jun", value: 125000, return: 25 },
  ];

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Investor Dashboard</h1>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet size={20} />
                <span>Portfolio Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neon-cyan">{formatCurrency(portfolioValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center space-x-2">
                {totalReturn >= 0 ? (
                  <>
                    <TrendingUp className="text-green-400" size={24} />
                    <span className="text-green-400">{formatCurrency(totalReturn)}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="text-red-400" size={24} />
                    <span className="text-red-400">{formatCurrency(totalReturn)}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-foreground/60 mt-1">
                {formatPercentage(totalReturnPercent)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <TokenBalance />
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <PerformanceLineChart data={performanceData} />
            </div>
          </CardContent>
        </Card>

        {/* Recommended Properties */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recommended Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties?.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

