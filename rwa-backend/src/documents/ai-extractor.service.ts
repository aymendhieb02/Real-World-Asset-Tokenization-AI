import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import axios from 'axios';

@Injectable()
export class AiExtractorService {
  private readonly logger = new Logger(AiExtractorService.name);
  private pythonApiUrl: string;

  constructor(private configService: ConfigService) {
    this.pythonApiUrl = this.configService.get('PYTHON_EXTRACTION_API_URL') || 'http://localhost:5000/api';
    this.pythonApiUrl = this.pythonApiUrl.replace(/\/$/, '');
  }

  async extractPropertyData(pdfBuffer: Buffer, documentType: string, filename?: string) {
    try {
      this.logger.log(`Extracting data from PDF: ${filename || 'document.pdf'}`);
      this.logger.log(`Using Python API URL: ${this.pythonApiUrl}`);
      this.logger.log(`Buffer size: ${pdfBuffer.length} bytes`);

      // Create form data
      const formData = new FormData();
      
      // Append buffer as a file
      formData.append('file', pdfBuffer, {
        filename: filename || 'document.pdf',
        contentType: 'application/pdf',
      });

      this.logger.log('Sending request to Python API...');

      // Use axios instead of fetch for better FormData support
      const response = await axios.post(
        `${this.pythonApiUrl}/extract`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      this.logger.log(`Python API response status: ${response.status}`);
      
      const pythonResponse = response.data;
      
      this.logger.log('Successfully extracted data from Python API');
      this.logger.debug(`Extraction result: ${JSON.stringify(pythonResponse)}`);

      return this.mapPythonResponseToExpectedFormat(pythonResponse, documentType);
      
    } catch (error) {
      this.logger.error(`Failed to extract data from Python API: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      
      this.logger.error(`Error stack: ${error.stack}`);
      throw new Error(`Failed to extract data from Python API: ${error.message}`);
    }
  }

  private mapPythonResponseToExpectedFormat(pythonResponse: any, documentType: string) {
    if (!pythonResponse.success) {
      throw new Error(pythonResponse.error || 'Extraction failed');
    }

    const data = pythonResponse.data || {};
    
    return {
      success: pythonResponse.success,
      extractedData: {
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        postalCode: data.postal_code || null,
        zip: data.postal_code || null,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        rooms: data.rooms || null,
        toilets: data.toilets || null,
        kitchens: data.kitchens || null,
        area: data.area || null,
        sqft: data.area || null,
        price: data.price || null,
        appraised_value: data.price || null,
        parcel_number: data.parcel_number || null,
        lot_size: data.lot_size || null,
        year_built: data.year_built || null,
        property_type: data.property_type || null,
        owner_name: data.owner_name || null,
        legal_description: data.legal_description || null,
        condition: data.condition || null,
        overall_condition: data.overall_condition || null,
        issues: data.issues || [],
        documentType: documentType,
        extractionDate: data.extraction_date || new Date().toISOString(),
        textPreview: data.text_preview || null,
      },
      confidence: data.confidence || 0.0,
      metadata: pythonResponse.metadata || {},
    };
  }

  async checkPythonApiHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.pythonApiUrl}/health`);
      
      if (response.status === 200) {
        this.logger.log('Python API health check: OK');
        return true;
      } else {
        this.logger.warn(`Python API health check failed with status: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Python API health check failed: ${error.message}`);
      return false;
    }
  }
}