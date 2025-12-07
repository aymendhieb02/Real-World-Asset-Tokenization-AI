import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @Get('network/status')
  @ApiOperation({ summary: 'Check blockchain network connection' })
  @ApiResponse({ status: 200, description: 'Network status retrieved' })
  async getNetworkStatus() {
    try {
      const blockNumber = await this.blockchainService.getBlockNumber();
      return {
        success: true,
        connected: blockNumber > 0,
        latestBlock: blockNumber,
        network: 'Sepolia Testnet',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to connect to blockchain', error: error.message },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('kyc/:address')
  @ApiOperation({ summary: 'Check KYC verification status' })
  @ApiParam({ name: 'address', description: 'Ethereum wallet address' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved' })
  async checkKYC(@Param('address') address: string) {
    try {
      const isVerified = await this.blockchainService.isVerified(address);
      const info = isVerified ? await this.blockchainService.getInvestorInfo(address) : null;

      return {
        success: true,
        address,
        isVerified,
        info,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to check KYC status', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('token/:tokenAddress/info')
  @ApiOperation({ summary: 'Get token and property information' })
  @ApiParam({ name: 'tokenAddress', description: 'Property token contract address' })
  @ApiResponse({ status: 200, description: 'Token info retrieved' })
  async getTokenInfo(@Param('tokenAddress') tokenAddress: string) {
    try {
      const info = await this.blockchainService.getTokenInfo(tokenAddress);
      return {
        success: true,
        token: info,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to get token info', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('balance/:tokenAddress/:userAddress')
  @ApiOperation({ summary: 'Get token balance for an address' })
  @ApiParam({ name: 'tokenAddress', description: 'Property token contract address' })
  @ApiParam({ name: 'userAddress', description: 'User wallet address' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  async getBalance(
    @Param('tokenAddress') tokenAddress: string,
    @Param('userAddress') userAddress: string,
  ) {
    try {
      const balance = await this.blockchainService.getTokenBalance(tokenAddress, userAddress);
      return {
        success: true,
        tokenAddress,
        userAddress,
        balance,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to get balance', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('dividend/:tokenAddress/:investorAddress')
  @ApiOperation({ summary: 'Get pending dividend for an investor' })
  @ApiParam({ name: 'tokenAddress', description: 'Property token contract address' })
  @ApiParam({ name: 'investorAddress', description: 'Investor wallet address' })
  @ApiResponse({ status: 200, description: 'Pending dividend retrieved' })
  async getPendingDividend(
    @Param('tokenAddress') tokenAddress: string,
    @Param('investorAddress') investorAddress: string,
  ) {
    try {
      const pending = await this.blockchainService.getPendingDividend(tokenAddress, investorAddress);
      return {
        success: true,
        tokenAddress,
        investorAddress,
        pendingDividend: pending,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to get pending dividend', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tokenize/:propertyId')
  @ApiOperation({ 
    summary: '🎊 TOKENIZE A PROPERTY - Deploy smart contract',
    description: `
**CRITICAL STEP**: This deploys a NEW PropertySecurityToken smart contract for the property.

Requirements:
1. Property must have estimated_price set (not null)
2. Property must not be already tokenized
3. ADMIN_PRIVATE_KEY and TOKEN_FACTORY_ADDRESS must be configured

Process:
1. Fetches property from database
2. Validates estimated_price exists
3. Calls factory contract to deploy new token
4. Updates property.tokenAddress in database

After this, you can issue tokens to investors.
    `
  })
  @ApiParam({ name: 'propertyId', description: 'Property UUID from database' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property tokenized successfully',
    schema: {
      example: {
        success: true,
        message: 'Property tokenized successfully',
        tokenAddress: '0x1234567890abcdef...',
        transactionHash: '0xabcdef...',
        explorerUrl: 'https://sepolia.etherscan.io/tx/0xabcdef...',
        property: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: '123 Main St',
          valuation: 500000,
          totalTokens: 1000,
          tokenAddress: '0x1234567890abcdef...'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Property already tokenized or estimated_price is null' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 500, description: 'Blockchain transaction failed' })
  async tokenizeProperty(@Param('propertyId') propertyId: string) {
    try {
      const result = await this.blockchainService.tokenizeProperty(propertyId);

      return {
        success: true,
        message: 'Property tokenized successfully',
        tokenAddress: result.tokenAddress,
        transactionHash: result.transactionHash,
        explorerUrl: `https://sepolia.etherscan.io/tx/${result.transactionHash}`,
        property: {
          id: result.property.id,
          name: result.property.name,
          valuation: result.property.valuation,
          totalTokens: result.property.totalTokens,
          tokenAddress: result.tokenAddress,
        }
      };
    } catch (error) {
      throw new HttpException(
        { 
          success: false, 
          message: 'Tokenization failed', 
          error: error.message 
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('kyc/verify')
  @ApiOperation({ summary: 'Verify an investor on-chain (admin only)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['investorAddress', 'investorType', 'countryCode'],
      properties: {
        investorAddress: { 
          type: 'string', 
          example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
          description: 'Investor wallet address'
        },
        investorType: { 
          type: 'number', 
          example: 2,
          description: '1=Retail, 2=Accredited, 3=Institutional'
        },
        countryCode: { 
          type: 'string', 
          example: 'US',
          description: 'Two-letter country code'
        },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Investor verified on-chain' })
  async verifyInvestor(@Body() body: { investorAddress: string; investorType: number; countryCode: string }) {
    try {
      const txHash = await this.blockchainService.verifyInvestor(
        body.investorAddress,
        body.investorType,
        body.countryCode,
      );

      return {
        success: true,
        message: 'Investor verified on-chain',
        transactionHash: txHash,
        explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'KYC verification failed', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('token/:tokenAddress/investment-info')
  @ApiOperation({ 
    summary: 'Get property investment information',
    description: 'Returns token price, access control status, and calculates tokens for a given investment amount'
  })
  @ApiParam({ name: 'tokenAddress', description: 'Token contract address' })
  @ApiQuery({ name: 'investmentAmount', required: false, description: 'Investment amount in USD to calculate tokens' })
  @ApiResponse({ status: 200, description: 'Investment information retrieved successfully' })
  async getInvestmentInfo(
    @Param('tokenAddress') tokenAddress: string,
    @Query('investmentAmount') investmentAmount?: string,
  ) {
    try {
      const amount = investmentAmount ? parseFloat(investmentAmount) : undefined;
      const info = await this.blockchainService.getPropertyInvestmentInfo(tokenAddress, amount);
      return {
        success: true,
        ...info,
      };
    } catch (error) {
      throw new HttpException(
        { 
          success: false, 
          message: 'Failed to get investment info', 
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('token/issue')
  @ApiOperation({ summary: 'Issue tokens to an investor (after tokenization)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['tokenAddress', 'investorAddress', 'amount'],
      properties: {
        tokenAddress: { 
          type: 'string', 
          example: '0xe50102d48F0fA7C0c0f915D717Ec6D40cDDFB3fb',
          description: 'Property token contract address'
        },
        investorAddress: { 
          type: 'string', 
          example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
          description: 'Investor wallet address (must be KYC verified)'
        },
        amount: { 
          type: 'string', 
          example: '100',
          description: 'Number of tokens to issue'
        },
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Tokens issued successfully' })
  async issueTokens(@Body() body: { tokenAddress: string; investorAddress: string; amount: string }) {
    try {
      const txHash = await this.blockchainService.issueTokens(
        body.tokenAddress,
        body.investorAddress,
        body.amount,
      );

      // Get network info for explorer URL (Sepolia testnet)
      const explorerBaseUrl = 'https://sepolia.etherscan.io';

      return {
        success: true,
        message: 'Tokens issued successfully',
        transactionHash: txHash,
        explorerUrl: `${explorerBaseUrl}/tx/${txHash}`,
        issuedTo: body.investorAddress,
        amount: body.amount,
      };
    } catch (error: any) {
      console.error('[BlockchainController] Token issuance error:', error);
      throw new HttpException(
        { 
          success: false, 
          message: 'Token issuance failed', 
          error: error.message || 'Unknown error',
          details: error.reason || error.data || undefined,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('token/:tokenAddress/grant-issuer-role')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Grant ISSUER_ROLE to an address',
    description: 'Grants ISSUER_ROLE to the specified address. Requires the admin wallet to have DEFAULT_ADMIN_ROLE.'
  })
  @ApiParam({ name: 'tokenAddress', description: 'Token contract address' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Address to grant ISSUER_ROLE to',
          example: '0x1234567890abcdef...'
        }
      },
      required: ['address']
    }
  })
  @ApiResponse({ status: 200, description: 'ISSUER_ROLE granted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid address or already has role' })
  @ApiResponse({ status: 500, description: 'Failed to grant role' })
  async grantIssuerRole(
    @Param('tokenAddress') tokenAddress: string,
    @Body() body: { address: string }
  ) {
    try {
      const txHash = await this.blockchainService.grantIssuerRole(tokenAddress, body.address);
      return {
        success: true,
        message: 'ISSUER_ROLE granted successfully',
        transactionHash: txHash,
        explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
      };
    } catch (error) {
      throw new HttpException(
        { 
          success: false, 
          message: 'Failed to grant ISSUER_ROLE', 
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}