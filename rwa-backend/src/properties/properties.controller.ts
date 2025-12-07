import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Delete,
  Param, 
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({ status: 200, description: 'Properties retrieved successfully' })
  async getAllProperties() {
    return this.propertiesService.getAllProperties();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async getPropertyById(@Param('id') id: string) {
    return this.propertiesService.getPropertyById(id);
  }

  @Post('create-from-pdf')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create property from PDF - extracts all data automatically' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF file containing property information'
        },
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Property created successfully from PDF' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or extraction failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPropertyFromPdf(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }

    return this.propertiesService.createPropertyFromPdf(file, req.user.sub);
  }

  // NEW ENDPOINT: Predict price using ML-API
  @Post(':id/predict-price')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🤖 Predict property price using AI',
    description: `
Calls the ML-API to predict the property price based on property features.
Updates the estimated_price field in the database.

This endpoint requires the property to have:
- zipCode
- bedrooms
- squareFeet

After this endpoint is called, you can tokenize the property using the estimated price.
    `
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Property ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Price predicted successfully',
    schema: {
      example: {
        success: true,
        message: 'Price predicted successfully',
        predictedPrice: 550000,
        property: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: '123 Main St',
          estimated_price: 550000,
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 400, description: 'Price prediction failed' })
  async predictPrice(@Param('id') id: string) {
    return this.propertiesService.predictPrice(id);
  }

  // NEW ENDPOINT: Update estimated price manually
  @Put(':id/estimate-price')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🤖 Set AI-estimated price manually',
    description: `
Updates the estimated_price field for a property.
This should be called by your AI integration after it estimates the property value.

After this endpoint is called, you can tokenize the property using the estimated price.
    `
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Property ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['estimatedPrice'],
      properties: {
        estimatedPrice: {
          type: 'number',
          example: 550000,
          description: 'AI-estimated property price in USD'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estimated price updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Estimated price updated successfully',
        property: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: '123 Main St',
          price: 500000,
          valuation: 500000,
          estimated_price: 550000,
          tokenAddress: '',
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async updateEstimatedPrice(
    @Param('id') id: string,
    @Body() body: { estimatedPrice: number }
  ) {
    return this.propertiesService.updateEstimatedPrice(id, body.estimatedPrice);
  }

  // DELETE ENDPOINT: Delete property
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🗑️ Delete a property',
    description: 'Deletes a property. Only the property owner can delete their own property.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Property ID', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Property deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Property deleted successfully'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - You can only delete your own properties' })
  async deleteProperty(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.propertiesService.deleteProperty(id, req.user.sub);
  }
}