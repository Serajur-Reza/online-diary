// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from './auth.guard';
import { LoginDTO } from 'src/users/dto/login-dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard) // Protect this specific route
  @Get('profile')
  getProfile(@Request() req) {
    return req?.user;
  }
}
