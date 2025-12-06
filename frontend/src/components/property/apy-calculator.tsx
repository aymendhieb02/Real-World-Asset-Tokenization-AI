"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface APYCalculatorProps {
  apy: number;
}

export function APYCalculator({ apy }: APYCalculatorProps) {
  const [investment, setInvestment] = useState("10000");
  const [years, setYears] = useState("1");

  const principal = parseFloat(investment) || 0;
  const timeYears = parseFloat(years) || 0;
  const annualReturn = principal * (apy / 100);
  const totalReturn = principal * Math.pow(1 + apy / 100, timeYears);
  const profit = totalReturn - principal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator size={20} />
          <span>APY Calculator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Initial Investment (USD)</label>
          <Input
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            placeholder="10000"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Time Period (Years)</label>
          <Input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="1"
            min="1"
            max="10"
          />
        </div>

        {principal > 0 && timeYears > 0 && (
          <div className="space-y-3 p-4 glass rounded-lg">
            <div className="flex justify-between">
              <span className="text-foreground/70">APY</span>
              <span className="font-semibold text-neon-cyan">{formatPercentage(apy)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Annual Return</span>
              <span className="font-semibold">{formatCurrency(annualReturn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Total After {timeYears} {timeYears === 1 ? "Year" : "Years"}</span>
              <span className="font-semibold text-green-400">{formatCurrency(totalReturn)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="font-semibold">Total Profit</span>
              <span className="font-bold text-green-400">{formatCurrency(profit)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

