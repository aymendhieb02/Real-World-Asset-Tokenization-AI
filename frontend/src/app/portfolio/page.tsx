"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TokenBalance } from "@/components/web3/token-balance";

export default function PortfolioPage() {
  // Mock holdings
  const holdings = [
    { propertyId: "1", name: "Miami Beach Condo", tokens: 1250, value: 1312.5, return: 5 },
    { propertyId: "2", name: "Seattle Office", tokens: 500, value: 510, return: 2 },
  ];

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalReturn = holdings.reduce((sum, h) => sum + (h.value * h.return / 100), 0);

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <CardTitle>Total Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">{formatCurrency(totalReturn)}</div>
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

        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holdings.map((holding) => (
                <div key={holding.propertyId} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div>
                    <div className="font-semibold">{holding.name}</div>
                    <div className="text-sm text-foreground/60">{holding.tokens} tokens</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(holding.value)}</div>
                    <div className="text-sm text-green-400">+{formatPercentage(holding.return)}</div>
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

