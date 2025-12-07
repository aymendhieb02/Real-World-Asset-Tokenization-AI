import { Controller, Post, Get, Put, Body, Param, UseGuards, Request, Query, BadRequestException } from '@nestjs/common';
import { KycService } from './kyc.service';
import { SubmitKycDto, UpdateKycStatusDto, KycStatus } from './dto/kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('kyc')
export class KycController {
  constructor(
    private kycService: KycService,
    private prisma: PrismaService,
  ) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submitKyc(@Request() req, @Body() submitKycDto: SubmitKycDto) {
    return this.kycService.submitKyc(req.user.id, submitKycDto);
  }

  // NEW: Get KYC status by wallet address (public endpoint - no auth required)
  // This must come before 'status/:userId' to avoid route conflicts
  @Get('status-by-wallet/:walletAddress')
  async getStatusByWallet(@Param('walletAddress') walletAddress: string) {
    return this.kycService.getKycStatusByWallet(walletAddress);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Request() req) {
    if (!req.user || !req.user.sub) {
      throw new BadRequestException('User ID is required');
    }
    return this.kycService.getKycStatus(req.user.sub);
  }

  @Get('status/:userId')
  @UseGuards(JwtAuthGuard)
  async getStatusWithBlockchain(@Param('userId') userId: string) {
    return this.kycService.getKycStatusWithBlockchain(userId);
  }

  // NEW: Auto-verify KYC by wallet address (for investors)
  // Note: This endpoint requires authentication to prevent abuse
  @Post('auto-verify-by-wallet')
  @UseGuards(JwtAuthGuard)
  async autoVerifyByWallet(@Request() req, @Body() body: { walletAddress: string }) {
    if (!body.walletAddress) {
      throw new BadRequestException('Wallet address is required');
    }
    // Verify that the wallet address belongs to the authenticated user
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!user || user.walletAddress?.toLowerCase() !== body.walletAddress.toLowerCase()) {
      throw new BadRequestException('Wallet address does not match your account');
    }
    return this.kycService.autoVerifyKycByWallet(body.walletAddress);
  }

  // Admin endpoints
  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingKyc() {
    // TODO: Add admin guard
    return this.kycService.getAllPendingKyc();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllKyc(@Query('status') status?: KycStatus) {
    // TODO: Add admin guard
    return this.kycService.getAllKyc(status);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateKycStatusDto) {
    // TODO: Add admin guard
    return this.kycService.updateKycStatus(id, updateDto);
  }

  @Post(':id/verify-on-chain')
  @UseGuards(JwtAuthGuard)
  async verifyOnChain(@Param('id') id: string) {
    // TODO: Add admin guard
    return this.kycService.verifyKycOnChain(id);
  }
}
