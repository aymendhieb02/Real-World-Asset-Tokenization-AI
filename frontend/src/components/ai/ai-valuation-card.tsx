"use client";

import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIValuation } from "@/types";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";

interface AIValuationCardProps {
  valuation: AIValuation;
  propertyName?: string;
}

export function AIValuationCard({ valuation, propertyName }: AIValuationCardProps) {
  const TrendIcon = valuation.marketTrend === "up" ? TrendingUp : valuation.marketTrend === "down" ? TrendingDown : Minus;
  const trendColor = valuation.marketTrend === "up" ? "text-green-400" : valuation.marketTrend === "down" ? "text-red-400" : "text-foreground/60";

  return (
    <GlassmorphismCard>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="text-neon-cyan" size={24} />
            <span>AI Valuation</span>
          </CardTitle>
          <Badge variant="neon" className="text-xs">
            {valuation.confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Value */}
        <div>
          <div className="text-sm text-foreground/60 mb-1">Estimated Value</div>
          <div className="text-4xl font-bold text-neon-cyan">
            {formatCurrency(valuation.value)}
          </div>
        </div>

        {/* Trend Prediction */}
        {(valuation.predictedValue6Months || valuation.predictedValue12Months) && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <TrendIcon className={trendColor} size={16} />
              <span className="text-foreground/70">Market Trend: {valuation.marketTrend.toUpperCase()}</span>
            </div>
            {valuation.predictedValue6Months && (
              <div className="text-sm text-foreground/60">
                6 months: {formatCurrency(valuation.predictedValue6Months)} (
                {formatPercentage(((valuation.predictedValue6Months - valuation.value) / valuation.value) * 100)})
              </div>
            )}
            {valuation.predictedValue12Months && (
              <div className="text-sm text-foreground/60">
                12 months: {formatCurrency(valuation.predictedValue12Months)} (
                {formatPercentage(((valuation.predictedValue12Months - valuation.value) / valuation.value) * 100)})
              </div>
            )}
          </div>
        )}

        {/* Key Factors */}
        <div>
          <div className="text-sm font-semibold mb-2">Key Factors</div>
          <ul className="space-y-1">
            {valuation.factors.map((factor, index) => (
              <li key={index} className="text-sm text-foreground/70 flex items-start">
                <span className="text-neon-cyan mr-2">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </GlassmorphismCard>
  );
}

