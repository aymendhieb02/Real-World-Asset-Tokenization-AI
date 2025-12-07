import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        holdings: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateWalletAddress(userId: string, walletAddress: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { walletAddress: walletAddress.toLowerCase() },
    });
  }

  async getUserHoldings(userId: string) {
    return this.prisma.userHolding.findMany({
      where: { userId },
      include: {
        property: true,
      },
    });
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { fromAddress: { equals: userId, mode: 'insensitive' } },
          { toAddress: { equals: userId, mode: 'insensitive' } },
        ],
      },
      orderBy: { timestamp: 'desc' },
      include: {
        property: true,
      },
    });
  }
}
