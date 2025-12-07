// Simple mock data for property valuations
import { AIValuation, AIPortfolioRecommendation } from "@/types";

export async function getAIValuation(propertyId: string): Promise<AIValuation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI valuation data
      const valuations: Record<string, AIValuation> = {
    "1": {
      value: 550000,
      confidence: 87,
      riskScore: 35,
      marketTrend: "up",
      factors: [
        "New school district rating increased by 15%",
        "Amazon warehouse opening nearby (+8% value in 6 months)",
        "Beachfront location premium",
        "Recent renovations increase value",
        "Strong rental demand in area",
      ],
      predictedValue6Months: 575000,
      predictedValue12Months: 605000,
    },
    "2": {
      value: 2500000,
      confidence: 92,
      riskScore: 28,
      marketTrend: "up",
      factors: [
        "High occupancy rate (95%)",
        "Prime downtown location",
        "Long-term lease agreements",
        "Growing tech sector in Seattle",
        "Stable rental income",
      ],
      predictedValue6Months: 2600000,
      predictedValue12Months: 2750000,
    },
    "3": {
      value: 1800000,
      confidence: 85,
      riskScore: 42,
      marketTrend: "neutral",
      factors: [
        "Industrial property in growing area",
        "Fully leased with major tenants",
        "Modern facilities reduce maintenance costs",
        "Economic uncertainty in sector",
        "Good location for logistics",
      ],
      predictedValue6Months: 1820000,
      predictedValue12Months: 1850000,
    },
    "4": {
      value: 1200000,
      confidence: 78,
      riskScore: 55,
      marketTrend: "down",
      factors: [
        "Historic property requires maintenance",
        "San Francisco market cooling",
        "High property taxes",
        "Strong rental potential",
        "Gentrification in area",
      ],
      predictedValue6Months: 1180000,
      predictedValue12Months: 1150000,
    },
    "5": {
      value: 950000,
      confidence: 80,
      riskScore: 38,
      marketTrend: "up",
      factors: [
        "Music industry growth in Nashville",
        "Multiple revenue streams (studio + events)",
        "Prime Music Row location",
        "Modern facilities attract top artists",
        "Tourism boost to area",
      ],
      predictedValue6Months: 980000,
      predictedValue12Months: 1020000,
    },
  };

      resolve(valuations[propertyId] || {
        value: 500000,
        confidence: 75,
        riskScore: 50,
        marketTrend: "neutral",
        factors: ["Standard market valuation"],
      });
    }, 800);
  });
}

export async function getAIPortfolioRecommendation(
  userId: string
): Promise<AIPortfolioRecommendation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
    recommendedAssets: [
      {
        propertyId: "1",
        allocation: 35,
        rationale: "High growth potential with low risk score",
      },
      {
        propertyId: "2",
        allocation: 30,
        rationale: "Stable income with strong fundamentals",
      },
      {
        propertyId: "5",
        allocation: 20,
        rationale: "Diversification into commercial real estate",
      },
      {
        propertyId: "3",
        allocation: 15,
        rationale: "Industrial exposure for portfolio balance",
      },
    ],
    diversificationScore: 82,
    rationale: [
      "Portfolio is well-diversified across property types",
      "Geographic spread reduces regional risk",
      "Mix of high-growth and stable income properties",
      "Recommended allocation balances risk and return",
    ],
        expectedReturn: 10.5,
        riskLevel: "medium",
      });
    }, 1000);
  });
}

