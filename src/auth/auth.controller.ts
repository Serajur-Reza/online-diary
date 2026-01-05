// src/auth/auth.controller.ts
import { Body, Controller, Post, Patch, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDTO } from 'src/auth/dto/login-dto';
import { ChangePasswordDTO } from './dto/change-password';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async loginController(@Body() body: LoginDTO) {
    return this.authService.loginService(body);
  }

  // @UseGuards(AuthGuard) // Protect this specific route
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req?.user;
  // }

  // @UseGuards(AuthGuard) // Protect this specific route
  @Patch('change-password')
  async changePasswordController(@Body() body: ChangePasswordDTO) {
    return await this.authService.changePasswordService(body);
  }

  @Post('refresh-token')
  async refreshTokenController(@Request() req) {
    return await this.authService.refreshTokenService(req);
  }
}
