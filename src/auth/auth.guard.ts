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
    try {
      const request = context.switchToHttp().getRequest();

      const accessToken = this.extractAccessTokenFromHeader(request);

      const refreshToken = this.extractRefreshToken(request);

      if (!accessToken) {
        throw new UnauthorizedException('No access token provided');
      }

      // const payload = this.jwtService.decode(accessToken as string);

      const payload = await this.jwtService.verifyAsync(accessToken as string, {
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'), // In production, use ConfigService
      });

      // console.log('erroorroe', payload);

      // const access =
      //   Number(this.configService.get('JWT_ACCESS_VALIDITY')?.slice(0, -1)) *
      //   60 *
      //   1000;

      // const expiryTime = Number(payload?.iat * 1000) + access;

      // const refreshPayload = this.jwtService.decode(refreshToken as string);

      // // const refreshPayload = await this.jwtService.signAsync(
      // //   refreshToken as string,
      // //   {
      // //     secret: this.configService.get('JWT_REFRESH_SECRET_KEY'), // In production, use ConfigService
      // //   },
      // // );

      // const refresh =
      //   Number(this.configService.get('JWT_REFRESH_VALIDITY')?.slice(0, -1)) *
      //   24 *
      //   60 *
      //   60 *
      //   1000;

      // const refreshExpiryTime = Number(refreshPayload?.iat * 1000) + refresh;

      // const current = Date.now();

      // console.log('fdkalgfarkljfko');

      // if (current > expiryTime) {
      //   // console.log('access token expired 1');
      //   // const { iat, exp, nbf, ...cleanPayload } = payload;
      //   // const accessToken = await this.jwtService.signAsync(cleanPayload, {
      //   //   secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
      //   //   expiresIn: this.configService.get('JWT_ACCESS_VALIDITY'),
      //   // });

      //   // console.log('access token expired 2');
      //   // // request['headers']['authorization'] = `Bearer ${accessToken}`;

      //   // // console.log('set new token', request['headers']['authorization']);

      //   // this.setAccessToken(request, accessToken);
      //   // // this.canActivate(context);
      //   throw new Error('Your access token expired');
      // }

      // if (current > refreshExpiryTime) {
      //   throw new Error('You are unauthorized');
      // }
      // Attach the user payload to the request object
      request['user'] = payload;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Your session has expired.');
      }
      throw new UnauthorizedException(
        error?.message || 'Invalid or expired token',
      );
    }
    return true;
  }

  private extractAccessTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefreshToken(request: Request): string | undefined {
    const [type, token] = request.headers.cookie?.split('=') ?? [];
    // return type === 'Bearer' ? token : undefined;

    return token;
  }
}
