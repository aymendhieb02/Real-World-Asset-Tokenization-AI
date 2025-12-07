import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  propertyType: string; // 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL'

  @IsNumber()
  @Min(0)
  valuation: number;

  @IsNumber()
  @Min(1)
  totalTokens: number;

  @IsNumber()
  @Min(0)
  tokenPrice: number;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  squareFeet?: number;

  @IsOptional()
  @IsNumber()
  yearBuilt?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  tokenAddress: string;
}
