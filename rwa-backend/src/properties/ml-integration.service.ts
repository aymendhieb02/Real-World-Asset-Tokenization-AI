import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Property } from '@prisma/client';

@Injectable()
export class MlIntegrationService {
  private readonly logger = new Logger(MlIntegrationService.name);
  private mlApiUrl: string;

  constructor(private configService: ConfigService) {
    this.mlApiUrl = this.configService.get('ML_API_URL') || 'http://localhost:5001';
    this.mlApiUrl = this.mlApiUrl.replace(/\/$/, '');
  }

  async predictPropertyPrice(property: Property): Promise<number> {
    try {
      this.logger.log(`Predicting price for property ${property.id}`);
      this.logger.log(`Property data: zipCode=${property.zipCode}, bedrooms=${property.bedrooms}, squareFeet=${property.squareFeet}`);

      // Validate required fields - check for null/undefined explicitly
      const missingFields: string[] = [];
      
      if (!property.zipCode || property.zipCode === '00000' || property.zipCode === 'Not specified') {
        missingFields.push(`zipCode (current: ${property.zipCode})`);
      }

      if (property.bedrooms === null || property.bedrooms === undefined || property.bedrooms < 1) {
        missingFields.push(`bedrooms (current: ${property.bedrooms})`);
      }

      if (property.squareFeet === null || property.squareFeet === undefined || property.squareFeet < 100) {
        missingFields.push(`squareFeet (current: ${property.squareFeet})`);
      }

      if (missingFields.length > 0) {
        throw new Error(
          `Cannot predict price: Missing or invalid required fields: ${missingFields.join(', ')}. ` +
          `Please ensure the property has valid zip code, at least 1 bedroom, and at least 100 square feet. ` +
          `You may need to update the property details manually or re-upload the PDF with better extraction.`
        );
      }

      // Parse zip code - handle both string and number formats
      let zipCodeInt: number;
      if (typeof property.zipCode === 'string') {
        // Remove any non-numeric characters and take first 5 digits
        const zipMatch = property.zipCode.match(/\d{5}/);
        if (!zipMatch) {
          throw new Error(`Invalid zip code format: ${property.zipCode}`);
        }
        zipCodeInt = parseInt(zipMatch[0], 10);
        if (isNaN(zipCodeInt) || zipCodeInt <= 0) {
          throw new Error(`Invalid zip code: ${property.zipCode}`);
        }
      } else {
        zipCodeInt = Number(property.zipCode);
        if (isNaN(zipCodeInt) || zipCodeInt <= 0) {
          throw new Error(`Invalid zip code: ${property.zipCode}`);
        }
      }

      // Map property fields to ML-API request format
      // All 20 features must be included in the correct order
      // IMPORTANT: This must match the logic in the price prediction page exactly
      const houseSize = Number(property.squareFeet) || 0;
      const bed = Math.max(Number(property.bedrooms) || 0, 1); // Ensure at least 1
      const bath = Math.max(property.bathrooms ? Number(property.bathrooms) : 0, 1); // Ensure at least 1
      const lotSizeSqft = property.lotSize ? Number(property.lotSize) : 0;
      const acreLot = lotSizeSqft > 0 ? lotSizeSqft / 43560 : Math.max(0.01, 0); // Ensure at least 0.01
      const soldYear = 2024; // Default to current year
      const currentDate = new Date();
      const month = 6; // Use month 6 (June) to match price prediction page
      const monthSin = Math.sin(2 * Math.PI * month / 12);
      const monthCos = Math.cos(2 * Math.PI * month / 12);
      const yearsSince2000 = soldYear - 2000;
      const isRecent = soldYear >= 2015 ? 1 : 0; // Match price prediction page (>= 2015, not >= 2020)
      const decade = Math.floor(soldYear / 10) * 10; // Add decade field

      // Calculate derived features - match price prediction page exactly
      const sqftPerBed = houseSize / bed; // No need to check bed > 0, already ensured
      const bedBathRatio = bed / bath; // No need to check, already ensured
      const bedBathSum = bed + bath;
      const lotSizeSqftCalculated = acreLot * 43560; // Calculate from acres
      const houseToLotRatio = lotSizeSqftCalculated > 0 ? houseSize / lotSizeSqftCalculated : 0;

      // Build request data with all 20 features in the correct order
      const requestData: any = {
        // Core features (1-3)
        house_size: houseSize,
        bath: bath,
        bed: bed,
        
        // Derived features (4-9)
        sqft_per_bed: sqftPerBed,
        bed_bath_ratio: bedBathRatio,
        bed_bath_sum: bedBathSum,
        acre_lot: acreLot,
        lot_size_sqft: lotSizeSqftCalculated, // Use calculated from acres to match price prediction page
        house_to_lot_ratio: houseToLotRatio,
        
        // City features (10-11) - defaults, can be enhanced later
        city_size: 0, // TODO: Get from city data if available
        is_large_city: 0, // Match price prediction page (city_size > 1000 would be 1, but we use 0)
        
        // Time features (12-15)
        years_since_2000: yearsSince2000,
        is_recent: isRecent,
        decade: decade, // Add decade field to match price prediction page
        month_sin: monthSin,
        month_cos: monthCos,
        
        // Zip code statistics (16-20) - will be filled from API or use fallbacks like price prediction page
        zip_price_mean: null, // Will be set from API or fallback
        zip_price_median: null, // Will be set from API or fallback
        zip_size_mean: null, // Will be set from API or fallback
        zip_count: null, // Will be set from API or fallback
        zip_code: zipCodeInt,
        
        // Additional optional field
        sold_year: soldYear,
      };

      this.logger.log(`Request data: ${JSON.stringify(requestData)}`);

      // Try to fetch zip code statistics from ML-API (optional, don't fail if it doesn't work)
      try {
        const zipStatsResponse = await axios.get(
          `${this.mlApiUrl}/api/zip-codes/${zipCodeInt}/stats`,
          { timeout: 5000 }
        );
        
        if (zipStatsResponse?.data?.success && zipStatsResponse.data.stats) {
          const stats = zipStatsResponse.data.stats;
          // Update zip code statistics - convert to numbers
          requestData.zip_price_mean = stats.zip_price_mean != null ? Number(stats.zip_price_mean) : null;
          requestData.zip_price_median = stats.zip_price_median != null ? Number(stats.zip_price_median) : null;
          requestData.zip_size_mean = stats.zip_size_mean != null ? Number(stats.zip_size_mean) : null;
          requestData.zip_count = stats.zip_count != null ? Number(stats.zip_count) : null;
          this.logger.log(`✅ Fetched zip code statistics for ${zipCodeInt}`);
        }
      } catch (error: any) {
        this.logger.warn(`Could not fetch zip code statistics (continuing anyway): ${error?.message || 'Unknown error'}`);
        // Will use fallback calculations below
      }
      
      // Apply fallback calculations for zip stats if missing (match price prediction page logic)
      if (!requestData.zip_price_mean || requestData.zip_price_mean === 0) {
        requestData.zip_price_mean = houseSize * 150; // Fallback calculation
      }
      if (!requestData.zip_price_median || requestData.zip_price_median === 0) {
        requestData.zip_price_median = houseSize * 145; // Fallback calculation
      }
      if (!requestData.zip_size_mean || requestData.zip_size_mean === 0) {
        requestData.zip_size_mean = houseSize; // Fallback to house size
      }
      if (!requestData.zip_count || requestData.zip_count === 0) {
        requestData.zip_count = 100; // Default count
      }
      
      // Ensure ALL numeric features are numbers (not null/undefined) for the model
      // XGBoost requires all columns to be numeric (int, float, bool), not object/null
      const numericFeatures = [
        'house_size', 'bath', 'bed', 'sqft_per_bed', 'bed_bath_ratio', 
        'bed_bath_sum', 'acre_lot', 'lot_size_sqft', 'house_to_lot_ratio',
        'city_size', 'is_large_city', 'years_since_2000', 'is_recent',
        'month_sin', 'month_cos', 'zip_code',
        // Zip code statistics must also be numeric, not null
        'zip_price_mean', 'zip_price_median', 'zip_size_mean', 'zip_count'
      ];
      
      for (const feature of numericFeatures) {
        if (requestData[feature] === null || requestData[feature] === undefined || isNaN(requestData[feature])) {
          requestData[feature] = 0;
        } else {
          // Ensure it's a number type
          requestData[feature] = Number(requestData[feature]);
        }
      }

      // Call ML-API for price prediction using forecast endpoint (same as price prediction page)
      // This ensures consistency - both pages use the same model and logic
      this.logger.log(`Calling ML-API: ${this.mlApiUrl}/api/forecast`);
      this.logger.log(`Request payload: ${JSON.stringify(requestData, null, 2)}`);
      
      let response;
      try {
        response = await axios.post(
          `${this.mlApiUrl}/api/forecast`,
          requestData,
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (axiosError: any) {
        // Extract error message from ML-API response if available
        let errorMessage = axiosError?.message || 'Unknown error';
        if (axiosError?.response?.data) {
          const errorDetail = axiosError.response.data.detail || axiosError.response.data.message || axiosError.response.data.error;
          if (errorDetail) {
            errorMessage = `ML-API error: ${errorDetail}`;
            this.logger.error(`ML-API error response: ${JSON.stringify(axiosError.response.data)}`);
          }
        }
        this.logger.error(`ML-API request failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      this.logger.log(`ML-API response status: ${response.status}`);
      this.logger.log(`ML-API response data: ${JSON.stringify(response.data)}`);

      // Handle response from forecast endpoint
      if (!response.data) {
        throw new Error('Empty response from ML-API');
      }

      let predictedPrice: number;
      // Forecast endpoint returns: { success: true, forecast: { current_price: ..., ... } }
      if (response.data.success && response.data.forecast && typeof response.data.forecast.current_price === 'number') {
        predictedPrice = response.data.forecast.current_price;
      } else if (response.data.status === 'success' && typeof response.data.predicted_price === 'number') {
        // Fallback to old format (predict-price endpoint)
        predictedPrice = response.data.predicted_price;
      } else {
        this.logger.error(`Unexpected response format: ${JSON.stringify(response.data)}`);
        throw new Error(`Invalid response format from ML-API: ${JSON.stringify(response.data)}`);
      }

      if (!predictedPrice || isNaN(predictedPrice) || predictedPrice <= 0) {
        throw new Error(`Invalid predicted price: ${predictedPrice}`);
      }

      this.logger.log(`✅ Price predicted successfully: $${predictedPrice}`);
      return predictedPrice;
    } catch (error: any) {
      this.logger.error(`Failed to predict property price: ${error?.message || 'Unknown error'}`);
      this.logger.error(`Error stack: ${error?.stack || 'No stack trace'}`);
      throw error; // Re-throw the error as-is (already has proper message)
    }
  }

  async checkMlApiHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.mlApiUrl}/health`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      this.logger.error(`ML-API health check failed: ${error.message}`);
      return false;
    }
  }
}

