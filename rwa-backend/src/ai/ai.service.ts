import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async analyzePortfolio(userId: string) {
    // Get user holdings
    const holdings = await this.prisma.userHolding.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (holdings.length === 0) {
      return {
        portfolio_value: 0,
        risk_score: 0,
        diversification: 'NONE',
        recommendations: [
          {
            action: 'START',
            message: 'Begin your real estate investment journey by exploring available properties',
            confidence: 1.0,
          },
        ],
      };
    }

    // Calculate portfolio metrics - Convert Decimal to number
    const totalValue = holdings.reduce(
      (sum, h) => sum + h.tokensOwned * this.toNumber(h.property.tokenPrice),
      0,
    );

    // Get city distribution
    const cityDistribution = this.calculateCityDistribution(holdings);
    const propertyTypeDistribution = this.calculatePropertyTypeDistribution(holdings);

    return this.getRecommendations(totalValue, cityDistribution, propertyTypeDistribution, userId);
  }

  async getPropertyRecommendations(userId: string, limit = 5) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        holdings: {
          include: { property: true },
        },
      },
    });

    const availableProperties = await this.prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        tokensSold: {
          lt: await this.prisma.property.findFirst().then(p => p?.totalTokens || 0),
        },
      },
      take: 20,
    });

    // Simple scoring based on diversification
    const userCities = new Set(user?.holdings.map(h => h.property.city) || []);
    
    const scored = availableProperties.map(prop => {
      let score = 0;
      
      // Prefer cities user doesn't have
      if (!userCities.has(prop.city)) score += 30;
      
      // Prefer properties with good availability
      const availabilityRatio = (prop.totalTokens - prop.tokensSold) / prop.totalTokens;
      score += availabilityRatio * 20;
      
      // Prefer moderately priced properties - Convert Decimal to number
      const tokenPrice = this.toNumber(prop.tokenPrice);
      if (tokenPrice >= 500 && tokenPrice <= 2000) score += 25;
      
      // Add some randomness
      score += Math.random() * 25;

      return { ...prop, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...prop }) => prop);
  }

  private calculateCityDistribution(holdings: any[]) {
    const total = holdings.reduce((sum, h) => sum + h.tokensOwned, 0);
    const byCity = {};
    
    holdings.forEach(h => {
      const city = h.property.city;
      if (!byCity[city]) byCity[city] = 0;
      byCity[city] += h.tokensOwned;
    });

    const distribution = {};
    Object.keys(byCity).forEach(city => {
      distribution[city] = ((byCity[city] / total) * 100).toFixed(1);
    });

    return distribution;
  }

  private calculatePropertyTypeDistribution(holdings: any[]) {
    const total = holdings.reduce((sum, h) => sum + h.tokensOwned, 0);
    const byType = {};
    
    holdings.forEach(h => {
      const type = h.property.propertyType;
      if (!byType[type]) byType[type] = 0;
      byType[type] += h.tokensOwned;
    });

    const distribution = {};
    Object.keys(byType).forEach(type => {
      distribution[type] = ((byType[type] / total) * 100).toFixed(1);
    });

    return distribution;
  }

  private async getRecommendations(totalValue: number, cityDist: any, typeDist: any, userId: string) {
    const diversificationScore = Object.keys(cityDist).length;
    
    const analysis = {
      portfolio_value: totalValue,
      risk_score: diversificationScore < 3 ? 65 : 35,
      diversification: diversificationScore < 3 ? 'LOW' : 'MEDIUM',
      recommendations: [
        {
          action: 'BUY',
          property_suggestion: 'Properties in different cities',
          reason: 'Increase geographic diversification to reduce risk',
          confidence: 0.85,
        },
      ],
    };

    // Save recommendation to database
    await this.prisma.aiRecommendation.create({
      data: {
        userId,
        recommendationType: 'PORTFOLIO_ANALYSIS',
        recommendation: analysis,
        confidence: 0.85,
      },
    });

    return analysis;
  }

  /**
   * Helper function to convert Prisma Decimal to number
   */
  private toNumber(decimal: Decimal | number): number {
    if (typeof decimal === 'number') {
      return decimal;
    }
    return decimal.toNumber();
  }
}