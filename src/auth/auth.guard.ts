// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'), // In production, use ConfigService
      });

      const access =
        Number(
          this.configService.get<string>('JWT_ACCESS_VALIDITY')?.slice(0, -1),
        ) *
        60 *
        1000;

      const expiryTime = Number(payload?.iat * 1000) + access;

      const current = Date.now();

      if (current > expiryTime) {
        throw new UnauthorizedException('Expired Token');
      }
      // Attach the user payload to the request object
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException(e?.message || 'Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
