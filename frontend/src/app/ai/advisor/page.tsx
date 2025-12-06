"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getAIPortfolioRecommendation } from "@/lib/api/mock-ai";
import { MainLayout } from "@/components/layout/main-layout";
import { AIPortfolioRecommendationWidget } from "@/components/ai/ai-portfolio-recommendation-widget";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIAdvisorPage() {
  const { address } = useAccount();
  const { data: recommendation, isLoading } = useQuery({
    queryKey: ["portfolio-recommendation", address],
    queryFn: () => getAIPortfolioRecommendation(address || "default"),
    enabled: !!address,
  });

  return (
    <MainLayout showSidebar role="investor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">AI Investment Advisor</h1>

        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : recommendation ? (
          <AIPortfolioRecommendationWidget recommendation={recommendation} />
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70">Connect your wallet to get personalized recommendations</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

