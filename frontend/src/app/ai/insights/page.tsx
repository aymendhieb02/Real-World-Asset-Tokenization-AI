"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function AIInsightsPage() {
  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">AI Market Insights</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain size={20} />
                <span>Market Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">
                AI analysis shows strong growth in residential properties in Miami and Seattle markets.
                Commercial real estate in tech hubs continues to show steady appreciation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70">
                Overall market risk remains moderate. Diversification across property types
                and geographic regions is recommended for optimal risk-adjusted returns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

