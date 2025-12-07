import { Injectable } from '@nestjs/common';
const pdfParse = require('pdf-parse');

@Injectable()
export class PdfParserService {
  async extractText(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }

  async extractMetadata(buffer: Buffer) {
    try {
      const data = await pdfParse(buffer);
      return {
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata,
      };
    } catch (error) {
      throw new Error(`Failed to extract PDF metadata: ${error.message}`);
    }
  }
}