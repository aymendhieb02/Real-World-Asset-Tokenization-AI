import { Controller, Get, UseGuards, Request, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('holdings')
  async getHoldings(@Request() req) {
    return this.usersService.getUserHoldings(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.usersService.getUserTransactions(req.user.id);
  }

  @Put('wallet')
  async updateWallet(@Request() req, @Body('walletAddress') walletAddress: string) {
    return this.usersService.updateWalletAddress(req.user.id, walletAddress);
  }
}
