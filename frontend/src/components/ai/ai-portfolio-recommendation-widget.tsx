"use client";

import { GlassmorphismCard } from "@/components/animations/glassmorphism-card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIPortfolioRecommendation } from "@/types";
import { formatPercentage } from "@/lib/utils";
import { Brain, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AIPortfolioRecommendationWidgetProps {
  recommendation: AIPortfolioRecommendation;
}

export function AIPortfolioRecommendationWidget({
  recommendation,
}: AIPortfolioRecommendationWidgetProps) {
  return (
    <GlassmorphismCard>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="text-neon-cyan" size={20} />
            <span>AI Portfolio Recommendations</span>
          </CardTitle>
          <Badge variant="neon">Diversification: {recommendation.diversificationScore}%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Expected Return */}
        <div className="flex items-center justify-between p-3 glass rounded-lg">
          <div>
            <div className="text-sm text-foreground/60">Expected Return</div>
            <div className="text-2xl font-bold text-green-400 flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>{formatPercentage(recommendation.expectedReturn)}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              recommendation.riskLevel === "low"
                ? "border-green-500/30 text-green-400 bg-green-500/20"
                : recommendation.riskLevel === "medium"
                ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/20"
                : "border-red-500/30 text-red-400 bg-red-500/20"
            }
          >
            {recommendation.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Recommended Assets */}
        <div>
          <div className="text-sm font-semibold mb-3">Recommended Allocation</div>
          <div className="space-y-2">
            {recommendation.recommendedAssets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 glass rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">Property #{asset.propertyId}</span>
                    <Badge variant="outline" className="text-xs">
                      {asset.allocation}%
                    </Badge>
                  </div>
                  <div className="text-xs text-foreground/60">{asset.rationale}</div>
                </div>
                <Link href={`/properties/${asset.propertyId}`}>
                  <Button variant="ghost" size="sm">
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Rationale */}
        <div>
          <div className="text-sm font-semibold mb-2">AI Analysis</div>
          <ul className="space-y-1">
            {recommendation.rationale.map((point, index) => (
              <li key={index} className="text-sm text-foreground/70 flex items-start">
                <span className="text-neon-cyan mr-2">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <Link href="/ai/advisor">
          <Button className="w-full" variant="neon">
            View Full Recommendations
          </Button>
        </Link>
      </CardContent>
    </GlassmorphismCard>
  );
}

