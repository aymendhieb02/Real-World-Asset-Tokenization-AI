import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { SubmitKycDto, UpdateKycStatusDto, KycStatus, InvestorType } from './dto/kyc.dto';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService,
  ) {}

  async submitKyc(userId: string, submitKycDto: SubmitKycDto) {
    // Check if user already has KYC
    const existingKyc = await this.prisma.kycData.findUnique({
      where: { userId },
    });

    if (existingKyc && existingKyc.status === 'VERIFIED') {
      throw new BadRequestException('KYC already verified');
    }

    // Create or update KYC record
    const kycData = await this.prisma.kycData.upsert({
      where: { userId },
      update: {
        ...submitKycDto,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      create: {
        userId,
        ...submitKycDto,
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });

    // Update user KYC status
    await this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'PENDING' },
    });

    return kycData;
  }

  async getKycStatus(userId: string) {
    if (!userId) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'User ID is required',
      };
    }

    const kycData = await this.prisma.kycData.findUnique({
      where: { userId },
    });

    if (!kycData) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'KYC not yet submitted',
      };
    }

    return kycData;
  }

  // NEW: Get KYC status by wallet address
  async getKycStatusByWallet(walletAddress: string) {
    if (!walletAddress) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'Wallet address is required',
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: { kycData: true },
    });

    if (!user) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'User not found for this wallet address',
      };
    }

    if (!user.kycData) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'KYC not yet submitted',
        walletAddress: user.walletAddress,
        userId: user.id,
      };
    }

    return {
      ...user.kycData,
      walletAddress: user.walletAddress,
      userId: user.id,
    };
  }

  // NEW: Automatically verify KYC by wallet address (for investors)
  async autoVerifyKycByWallet(walletAddress: string) {
    if (!walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }

    const normalizedWallet = walletAddress.toLowerCase();
    
    // Find user by wallet address
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: normalizedWallet },
      include: { kycData: true },
    });

    if (!user) {
      throw new NotFoundException('User not found for this wallet address');
    }

    // Check if user is an investor
    if (user.role !== 'investor') {
      throw new BadRequestException('Automatic KYC verification is only available for investors');
    }

    // Check if already verified on-chain
    let onChainVerified = false;
    try {
      onChainVerified = await this.blockchainService.isVerified(normalizedWallet);
    } catch (error) {
      this.logger.warn(`Failed to check on-chain KYC status: ${error.message}`);
    }

    if (onChainVerified) {
      // Already verified on-chain, update database
      if (user.kycData) {
        await this.prisma.kycData.update({
          where: { id: user.kycData.id },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      } else {
        // Create KYC record if it doesn't exist
        await this.prisma.kycData.create({
          data: {
            userId: user.id,
            fullName: user.fullName || 'Unknown',
            dateOfBirth: '',
            nationality: 'US',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            idNumber: '',
            investorType: 'RETAIL',
            status: 'VERIFIED',
            verifiedAt: new Date(),
            submittedAt: new Date(),
          },
        });
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { kycStatus: 'VERIFIED' },
      });

      return {
        success: true,
        status: 'VERIFIED',
        message: 'KYC already verified on-chain',
        onChainVerified: true,
      };
    }

    // Try to verify on-chain automatically
    try {
      // Create or update KYC record first
      let kycData = user.kycData;
      if (!kycData) {
        kycData = await this.prisma.kycData.create({
          data: {
            userId: user.id,
            fullName: user.fullName || 'Unknown',
            dateOfBirth: '',
            nationality: 'US',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            idNumber: '',
            investorType: 'RETAIL',
            status: 'PENDING',
            submittedAt: new Date(),
          },
        });
      }

      // Verify on blockchain
      // Use the investor type from KYC data if available, otherwise default to RETAIL
      const investorTypeEnum = (kycData.investorType as InvestorType) || InvestorType.RETAIL;
      const investorType = this.getInvestorTypeNumber(investorTypeEnum);
      const countryCode = kycData.nationality || 'US';
      
      this.logger.log(
        `Verifying investor on-chain: wallet=${normalizedWallet}, ` +
        `investorType=${investorTypeEnum} (${investorType}), countryCode=${countryCode}`
      );
      
      const txHash = await this.blockchainService.verifyInvestor(
        normalizedWallet,
        investorType,
        countryCode,
      );

      // Update KYC status
      await this.prisma.kycData.update({
        where: { id: kycData.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
        },
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: { kycStatus: 'VERIFIED' },
      });

      this.logger.log(`✅ Auto-verified KYC for wallet ${normalizedWallet}: ${txHash}`);

      return {
        success: true,
        status: 'VERIFIED',
        message: 'KYC verified successfully',
        transactionHash: txHash,
        onChainVerified: true,
      };
    } catch (error) {
      this.logger.error(`Failed to auto-verify KYC: ${error.message}`);
      
      // If verification fails, still mark as pending
      if (user.kycData) {
        await this.prisma.kycData.update({
          where: { id: user.kycData.id },
          data: { status: 'PENDING' },
        });
      }

      return {
        success: false,
        status: 'PENDING',
        message: `KYC verification failed: ${error.message}`,
        onChainVerified: false,
      };
    }
  }

  async updateKycStatus(kycId: string, updateDto: UpdateKycStatusDto) {
    const kycData = await this.prisma.kycData.findUnique({
      where: { id: kycId },
    });

    if (!kycData) {
      throw new NotFoundException('KYC record not found');
    }

    const updated = await this.prisma.kycData.update({
      where: { id: kycId },
      data: {
        status: updateDto.status,
        rejectionReason: updateDto.rejectionReason,
        verifiedAt: updateDto.status === 'VERIFIED' ? new Date() : null,
      },
    });

    // Update user KYC status
    await this.prisma.user.update({
      where: { id: kycData.userId },
      data: { kycStatus: updateDto.status },
    });

    return updated;
  }

  async getAllPendingKyc() {
    return this.prisma.kycData.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            walletAddress: true,
          },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async getAllKyc(status?: KycStatus) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    return this.prisma.kycData.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            walletAddress: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  getInvestorTypeNumber(type: InvestorType): number {
    // KYC contract expects investor types as: 1=RETAIL, 2=ACCREDITED, 3=INSTITUTIONAL, 4=QUALIFIED_PURCHASER
    // Note: Some contracts use 0-based (0-3), others use 1-based (1-4)
    // If contract rejects, try switching between 0-based and 1-based
    const mapping = {
      [InvestorType.RETAIL]: 1, // Changed from 0 to 1 (1-based enum)
      [InvestorType.ACCREDITED]: 2, // Changed from 1 to 2
      [InvestorType.INSTITUTIONAL]: 3, // Changed from 2 to 3
      [InvestorType.QUALIFIED_PURCHASER]: 4, // Changed from 3 to 4
    };
    const result = mapping[type] || 1; // Default to RETAIL (1) if not found
    this.logger.log(`Mapping investor type ${type} to number: ${result}`);
    return result;
  }

  async verifyKycOnChain(kycId: string) {
    const kycData = await this.prisma.kycData.findUnique({
      where: { id: kycId },
      include: { user: true },
    });

    if (!kycData) {
      throw new NotFoundException('KYC record not found');
    }

    if (!kycData.user.walletAddress) {
      throw new BadRequestException('User does not have a wallet address');
    }

    if (kycData.status !== 'VERIFIED') {
      throw new BadRequestException('KYC must be verified off-chain before on-chain verification');
    }

    try {
      // Verify on blockchain
      const investorType = this.getInvestorTypeNumber(kycData.investorType as InvestorType);
      const countryCode = kycData.nationality || 'US';
      
      const txHash = await this.blockchainService.verifyInvestor(
        kycData.user.walletAddress,
        investorType,
        countryCode,
      );

      this.logger.log(`✅ KYC verified on-chain for user ${kycData.userId}: ${txHash}`);

      return {
        success: true,
        transactionHash: txHash,
        kycId: kycData.id,
        walletAddress: kycData.user.walletAddress,
      };
    } catch (error) {
      this.logger.error(`Failed to verify KYC on-chain: ${error.message}`);
      throw new BadRequestException(`On-chain verification failed: ${error.message}`);
    }
  }

  async getKycStatusWithBlockchain(userId: string) {
    const kycData = await this.prisma.kycData.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!kycData) {
      return {
        status: 'NOT_SUBMITTED',
        message: 'KYC not yet submitted',
        onChainVerified: false,
      };
    }

    let onChainVerified = false;
    if (kycData.user.walletAddress) {
      try {
        onChainVerified = await this.blockchainService.isVerified(kycData.user.walletAddress);
      } catch (error) {
        this.logger.warn(`Failed to check on-chain KYC status: ${error.message}`);
      }
    }

    return {
      ...kycData,
      onChainVerified,
    };
  }
}
