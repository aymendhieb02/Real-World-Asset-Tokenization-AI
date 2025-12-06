"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { PerformanceLineChart } from "@/components/charts/performance-line-chart";
import { TrendingUp } from "lucide-react";

interface InvestmentSimulationProps {
  apy: number;
  initialPrice: number;
}

export function InvestmentSimulation({ apy, initialPrice }: InvestmentSimulationProps) {
  const [investment, setInvestment] = useState("10000");
  const [years, setYears] = useState("5");

  const principal = parseFloat(investment) || 0;
  const timeYears = parseFloat(years) || 0;

  // Generate simulation data
  const simulationData = Array.from({ length: timeYears * 12 }, (_, i) => {
    const months = i + 1;
    const value = principal * Math.pow(1 + apy / 100, months / 12);
    const returnPercent = ((value - principal) / principal) * 100;
    return {
      date: `Month ${months}`,
      value: value,
      return: returnPercent,
    };
  });

  const finalValue = principal * Math.pow(1 + apy / 100, timeYears);
  const totalProfit = finalValue - principal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp size={20} />
          <span>Investment Simulation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Investment (USD)</label>
            <Input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Years</label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              min="1"
              max="10"
            />
          </div>
        </div>

        {principal > 0 && timeYears > 0 && (
          <>
            <div className="h-64">
              <PerformanceLineChart data={simulationData} />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 glass rounded-lg">
              <div>
                <div className="text-sm text-foreground/60 mb-1">Initial Investment</div>
                <div className="text-xl font-bold">{formatCurrency(principal)}</div>
              </div>
              <div>
                <div className="text-sm text-foreground/60 mb-1">Final Value</div>
                <div className="text-xl font-bold text-green-400">{formatCurrency(finalValue)}</div>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/10">
                <div className="text-sm text-foreground/60 mb-1">Total Profit</div>
                <div className="text-2xl font-bold text-neon-cyan">{formatCurrency(totalProfit)}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

