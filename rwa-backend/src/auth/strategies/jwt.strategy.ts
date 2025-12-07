import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // payload = { sub: userId, email: ..., walletAddress: ... }
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    // CRITICAL FIX: Return payload with sub, not user object
    // user object has 'id', but we need 'sub' for the controller
    return {
      sub: payload.sub,        // This is what req.user.sub will be
      userId: user.id,         // Alternative field
      email: user.email,
      walletAddress: user.walletAddress,
    };
  }
}