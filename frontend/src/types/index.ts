// Property Types
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: "residential" | "commercial" | "industrial" | "land";
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  images: string[];
  description: string;
  tokenAddress?: string;
  totalTokens?: number;
  tokensAvailable?: number;
  pricePerToken?: number;
  apy?: number;
  createdAt: string;
  updatedAt: string;
}

// AI Valuation Types
export interface AIValuation {
  value: number;
  confidence: number;
  riskScore: number;
  marketTrend: "up" | "down" | "neutral";
  factors: string[];
  predictedValue6Months?: number;
  predictedValue12Months?: number;
  valueDrivers?: Array<{
    driver: string;
    impact: string;
    reason: string;
    confidence: number;
  }>;
}

// AI Portfolio Recommendation
export interface AIPortfolioRecommendation {
  recommendedAssets: {
    propertyId: string;
    allocation: number;
    rationale: string;
  }[];
  diversificationScore: number;
  rationale: string[];
  expectedReturn: number;
  riskLevel: "low" | "medium" | "high";
}

// Token Types
export interface TokenBalance {
  tokenAddress: string;
  propertyId: string;
  balance: string;
  value: number;
}

// Market Types
export interface Order {
  id: string;
  propertyId: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  timestamp: string;
  status: "pending" | "filled" | "cancelled";
}

export interface Trade {
  id: string;
  propertyId: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  timestamp: string;
  buyer: string;
  seller: string;
  txHash: string;
}

// Portfolio Types
export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  totalReturnPercent: number;
  holdings: {
    propertyId: string;
    tokens: number;
    value: number;
    return: number;
    returnPercent: number;
  }[];
}

// Dividend Types
export interface Dividend {
  id: string;
  propertyId: string;
  amount: number;
  perToken: number;
  distributionDate: string;
  claimable: boolean;
  claimed: boolean;
  txHash?: string;
}

// KYC Types
export interface KYCStatus {
  verified: boolean;
  level: "none" | "basic" | "advanced";
  submittedAt?: string;
  verifiedAt?: string;
  documents?: string[];
}

// User Types
export interface User {
  id: string;
  address: string;
  role: "investor" | "owner" | "admin";
  kyc: KYCStatus;
  createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProperties: number;
  totalValue: number;
  totalInvestors: number;
  totalVolume: number;
  averageAPY: number;
}

