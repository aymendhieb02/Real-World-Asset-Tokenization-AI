import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName, walletAddress } = registerDto;

    this.logger.log(`Attempting to register user: ${email}`);

    // Check if user exists by email
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      this.logger.warn(`User already exists: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // Check if wallet address is already in use (if provided)
    if (walletAddress) {
      const normalizedWallet = walletAddress.toLowerCase();
      const existingUserByWallet = await this.prisma.user.findUnique({
        where: { walletAddress: normalizedWallet },
      });

      if (existingUserByWallet) {
        this.logger.warn(`Wallet address already in use: ${normalizedWallet}`);
        throw new ConflictException('This wallet address is already associated with another account');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    this.logger.log('Password hashed successfully');

    // Create user
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          walletAddress: walletAddress?.toLowerCase() || null, // Set to null if empty string
          kycStatus: 'PENDING',
          role: registerDto.role || 'investor', // Default to investor if not specified
        },
      });

      this.logger.log(`User created successfully with ID: ${user.id}`);

      // Generate JWT with proper payload
      const token = this.generateToken(user);

      return {
        user: this.excludePassword(user),
        token,
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      this.logger.error(error.stack);
      
      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target && Array.isArray(target) && target.includes('email')) {
          throw new ConflictException('User with this email already exists');
        }
        if (target && Array.isArray(target) && target.includes('walletAddress')) {
          throw new ConflictException('This wallet address is already associated with another account. Please use a different wallet or register without a wallet address.');
        }
        throw new ConflictException('A user with these details already exists');
      }
      
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt for user: ${email}`);

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully: ${email}`);

    // Generate JWT with proper payload
    const token = this.generateToken(user);

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return this.excludePassword(user);
  }

  private generateToken(user: any) {
    // CRITICAL: Include 'sub' field for JWT validation
    const payload = {
      sub: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
    };

    this.logger.debug(`Generating token for user: ${user.id}`);
    return this.jwtService.sign(payload);
  }

  private excludePassword(user: any) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}