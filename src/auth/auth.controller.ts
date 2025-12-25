// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';
import { LoginDTO } from 'src/auth/dto/login-dto';
import { AuthGuard } from './auth.guard';
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
  changePasswordController(@Request() req, @Body() body: ChangePasswordDTO) {
    console.log('change password', body);
    return this.authService.changePasswordService(body);
  }
}
