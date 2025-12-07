import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum InvestorType {
  RETAIL = 'RETAIL',
  ACCREDITED = 'ACCREDITED',
  INSTITUTIONAL = 'INSTITUTIONAL',
  QUALIFIED_PURCHASER = 'QUALIFIED_PURCHASER',
}

export class SubmitKycDto {
  @IsString()
  fullName: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  nationality: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsString()
  idNumber: string;

  @IsEnum(InvestorType)
  investorType: InvestorType;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpdateKycStatusDto {
  @IsEnum(KycStatus)
  status: KycStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
