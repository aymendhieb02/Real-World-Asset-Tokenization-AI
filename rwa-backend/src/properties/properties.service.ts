import { Injectable, NotFoundException, Logger, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MlIntegrationService } from './ml-integration.service';
import FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);
  private pythonApiUrl: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mlIntegrationService: MlIntegrationService,
  ) {
    this.pythonApiUrl = this.configService.get('PYTHON_EXTRACTION_API_URL') || 'http://localhost:5000/api';
    this.pythonApiUrl = this.pythonApiUrl.replace(/\/$/, '');
  }

  async getAllProperties() {
    const properties = await this.prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      count: properties.length,
      properties,
    };
  }

  async getPropertyById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async createPropertyFromPdf(file: Express.Multer.File, userId: string) {
    try {
      this.logger.log(`📄 Creating property from PDF: ${file.originalname}`);
      this.logger.log(`👤 Owner ID: ${userId}`);

      const extractedData = await this.extractDataFromPdf(file.buffer, file.originalname);
      
      this.logger.log('✅ Data extracted successfully');
      this.logger.log(`Extracted data keys: ${Object.keys(extractedData).join(', ')}`);
      this.logger.log(`Extracted data: ${JSON.stringify(extractedData, null, 2)}`);

      const calculatedPrice = extractedData.price && extractedData.price > 10000 
        ? extractedData.price 
        : (extractedData.price || 100) * 1000;

      // Handle zip code - try multiple possible field names and formats
      let zipCode = extractedData.zip_code || extractedData.zipCode || extractedData.zip || '00000';
      if (typeof zipCode === 'number') {
        zipCode = zipCode.toString().padStart(5, '0');
      } else if (typeof zipCode === 'string') {
        // Extract first 5 digits
        const zipMatch = zipCode.match(/\d{5}/);
        zipCode = zipMatch ? zipMatch[0] : '00000';
      }

      // Handle bedrooms - try multiple field names (check for undefined/null, not falsy, since 0 is valid)
      const bedrooms = extractedData.bed !== undefined && extractedData.bed !== null 
        ? extractedData.bed 
        : (extractedData.bedrooms !== undefined && extractedData.bedrooms !== null 
          ? extractedData.bedrooms 
          : (extractedData.beds !== undefined && extractedData.beds !== null ? extractedData.beds : null));
      
      // Handle square feet - try multiple field names
      const squareFeet = extractedData.house_size !== undefined && extractedData.house_size !== null
        ? extractedData.house_size
        : (extractedData.squareFeet !== undefined && extractedData.squareFeet !== null
          ? extractedData.squareFeet
          : (extractedData.sqft !== undefined && extractedData.sqft !== null
            ? extractedData.sqft
            : (extractedData.square_feet !== undefined && extractedData.square_feet !== null ? extractedData.square_feet : null)));
      
      // Handle bathrooms - try multiple field names
      const bathrooms = extractedData.bath !== undefined && extractedData.bath !== null
        ? extractedData.bath
        : (extractedData.bathrooms !== undefined && extractedData.bathrooms !== null
          ? extractedData.bathrooms
          : (extractedData.baths !== undefined && extractedData.baths !== null ? extractedData.baths : null));
      
      // Handle lot size - try multiple field names
      const lotSize = extractedData.acre_lot !== undefined && extractedData.acre_lot !== null
        ? extractedData.acre_lot
        : (extractedData.lotSize !== undefined && extractedData.lotSize !== null
          ? extractedData.lotSize
          : (extractedData.lot_size !== undefined && extractedData.lot_size !== null ? extractedData.lot_size : null));

      this.logger.log(`Mapped fields: zipCode=${zipCode}, bedrooms=${bedrooms}, squareFeet=${squareFeet}, bathrooms=${bathrooms}`);

      const propertyData = {
        // REQUIRED STRING FIELDS
        name: extractedData.street || extractedData.address || file.originalname.replace('.pdf', ''),
        address: extractedData.street || extractedData.address || 'Not specified',
        city: extractedData.city || 'Not specified',
        state: extractedData.state || 'Not specified',
        zipCode: zipCode,
        propertyType: 'RESIDENTIAL',
        
        // REQUIRED DECIMAL FIELDS
        price: calculatedPrice,
        valuation: calculatedPrice,
        estimated_price: null, // ← SET TO NULL - AI will fill this later
        tokenPrice: calculatedPrice / 1000,
        
        // REQUIRED INT FIELDS
        totalTokens: 1000,
        tokensSold: 0,
        
        // REQUIRED STRING WITH DEFAULT
        tokenAddress: '',
        status: this.mapStatus(extractedData.status),
        
        // OPTIONAL INT FIELDS
        bedrooms: bedrooms ? Number(bedrooms) : null,
        squareFeet: squareFeet ? Math.round(Number(squareFeet)) : null,
        area: squareFeet ? Math.round(Number(squareFeet)) : null,
        lotSize: lotSize ? Math.round(Number(lotSize) * 43560) : null, // Convert acres to sqft
        yearBuilt: extractedData.year_built || extractedData.yearBuilt || null,
        
        // OPTIONAL DECIMAL FIELD
        bathrooms: bathrooms ? Number(bathrooms) : null,
        
        // OPTIONAL TEXT FIELD
        description: this.buildDescription(file.originalname, extractedData),
        
        // EXTRACTION METADATA
        extractionConfidence: extractedData.confidence > 1 ? extractedData.confidence / 100 : extractedData.confidence || 0,
        lastExtractedAt: new Date(),
        
        // OWNER
        ownerId: userId,
      };

      this.logger.log(`💾 Creating property with ${Object.keys(extractedData).length} extracted fields`);

      const property = await this.prisma.property.create({
        data: propertyData,
      });

      this.logger.log(`✅ Property created! ID: ${property.id}`);

      // Attempt automatic price prediction (non-blocking)
      this.predictPriceAsync(property.id).catch((error) => {
        this.logger.warn(`Automatic price prediction failed for property ${property.id}: ${error.message}`);
      });

      return {
        success: true,
        message: 'Property created successfully from PDF',
        property,
        extractedFields: {
          name: propertyData.name,
          price: propertyData.price,
          valuation: propertyData.valuation,
          estimated_price: null, // Will be set by AI later
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zipCode,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          squareFeet: propertyData.squareFeet,
          area: propertyData.area,
          lotSize: propertyData.lotSize,
          status: propertyData.status,
          tokenAddress: propertyData.tokenAddress,
        },
        confidence: propertyData.extractionConfidence,
        source: file.originalname,
      };

    } catch (error) {
      this.logger.error(`❌ Error: ${error.message}`);
      throw new BadRequestException(`Failed to create property: ${error.message}`);
    }
  }

  // NEW METHOD: Update estimated price (called by AI integration)
  async updateEstimatedPrice(propertyId: string, estimatedPrice: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }

    const updated = await this.prisma.property.update({
      where: { id: propertyId },
      data: { 
        estimated_price: estimatedPrice,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`✅ Updated estimated price for ${propertyId}: $${estimatedPrice}`);

    return {
      success: true,
      message: 'Estimated price updated successfully',
      property: updated,
    };
  }

  // DELETE METHOD: Delete property
  async deleteProperty(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }

    // Check if user is the owner
    if (property.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    // Delete the property
    await this.prisma.property.delete({
      where: { id: propertyId },
    });

    this.logger.log(`✅ Property deleted: ${propertyId} by user ${userId}`);

    return {
      success: true,
      message: 'Property deleted successfully',
    };
  }

  // NEW METHOD: Predict price using ML-API
  async predictPrice(propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property ${propertyId} not found`);
    }

    try {
      const predictedPrice = await this.mlIntegrationService.predictPropertyPrice(property);
      const updated = await this.updateEstimatedPrice(propertyId, predictedPrice);

      return {
        success: true,
        message: 'Price predicted successfully',
        predictedPrice,
        property: updated.property,
      };
    } catch (error) {
      this.logger.error(`Price prediction failed: ${error.message}`);
      throw new BadRequestException(`Price prediction failed: ${error.message}`);
    }
  }

  // Helper method for async price prediction (non-blocking)
  private async predictPriceAsync(propertyId: string) {
    try {
      // Wait a bit to ensure property is fully saved
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
      });

      if (!property) {
        this.logger.warn(`Property ${propertyId} not found for price prediction`);
        return;
      }

      // Log property fields for debugging
      this.logger.log(`Checking property ${propertyId} for price prediction: zipCode=${property.zipCode}, bedrooms=${property.bedrooms}, squareFeet=${property.squareFeet}`);

      // Only predict if we have required fields with valid values
      const hasValidZip = property.zipCode && property.zipCode !== '00000' && property.zipCode !== 'Not specified';
      const hasValidBedrooms = property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms >= 1;
      const hasValidSquareFeet = property.squareFeet !== null && property.squareFeet !== undefined && property.squareFeet >= 100;

      if (hasValidZip && hasValidBedrooms && hasValidSquareFeet) {
        try {
          const predictedPrice = await this.mlIntegrationService.predictPropertyPrice(property);
          await this.updateEstimatedPrice(propertyId, predictedPrice);
          this.logger.log(`✅ Automatic price prediction completed for property ${propertyId}: $${predictedPrice}`);
        } catch (error: any) {
          this.logger.error(`Price prediction failed for property ${propertyId}: ${error?.message || 'Unknown error'}`);
          // Don't throw - this is a background task, we don't want to break property creation
        }
      } else {
        this.logger.warn(
          `Skipping automatic price prediction for property ${propertyId} - missing or invalid required fields: ` +
          `zipCode=${property.zipCode} (valid: ${hasValidZip}), ` +
          `bedrooms=${property.bedrooms} (valid: ${hasValidBedrooms}), ` +
          `squareFeet=${property.squareFeet} (valid: ${hasValidSquareFeet})`
        );
      }
    } catch (error: any) {
      this.logger.error(`Error in predictPriceAsync for property ${propertyId}: ${error?.message || 'Unknown error'}`);
      // Don't throw - this is a background task
    }
  }

  private mapStatus(status: string | undefined): string {
    if (!status) return 'ACTIVE';
    
    const statusMap: any = {
      'available': 'ACTIVE',
      'immédiate': 'ACTIVE',
      'for sale': 'ACTIVE',
      'sold': 'SOLD_OUT',
      'pending': 'ACTIVE',
      'off market': 'INACTIVE',
    };
    
    return statusMap[status.toLowerCase()] || 'ACTIVE';
  }

  private buildDescription(filename: string, data: any): string {
    let desc = `Property extracted from ${filename}`;
    
    if (data.brokered_by) {
      desc += ` | Broker: ${data.brokered_by}`;
    }
    
    if (data.prev_sold_date) {
      desc += ` | Previous Sale: ${data.prev_sold_date}`;
    }
    
    return desc;
  }

  private async extractDataFromPdf(pdfBuffer: Buffer, filename: string) {
    try {
      this.logger.log(`Calling Python API: ${this.pythonApiUrl}/extract`);

      const formData = new FormData();
      formData.append('file', pdfBuffer, {
        filename: filename,
        contentType: 'application/pdf',
      });

      const response = await axios.post(
        `${this.pythonApiUrl}/extract`,
        formData,
        {
          headers: formData.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 30000,
        }
      );

      const result = response.data;
      if (!result.success) {
        throw new Error(result.error || 'Extraction failed');
      }

      return result.data || {};

    } catch (error) {
      this.logger.error(`Python API error: ${error.message}`);
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }
}