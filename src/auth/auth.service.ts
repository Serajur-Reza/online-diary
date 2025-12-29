// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/dto/login-dto';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDTO } from './dto/change-password';
import { hashPassword } from 'src/utils/passwordUtils';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginService(body: LoginDTO) {
    // if (!body?.email) {
    //   throw new UnauthorizedException('Please enter your registered email');
    // }

    // if (!body?.password) {
    //   throw new UnauthorizedException('Please enter your password');
    // }

    const dtoObject = plainToInstance(LoginDTO, body);

    // Validate
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((err) => {
          return err?.constraints;
        }),
      });
    }

    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(body?.password, user?.password);
    if (!isMatch) throw new UnauthorizedException('Password does not match');

    // console.log(
    //   this.configService.get('JWT_ACCESS_SECRET_KEY'),
    //   this.configService.get('JWT_REFRESH_SECRET_KEY'),
    // );

    const payload = { ...user };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_ACCESS_VALIDITY'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_VALIDITY'),
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async changePasswordService(body: ChangePasswordDTO) {
    // if (!body?.email) {
    //   throw new UnauthorizedException('Please enter your registered email');
    // }

    // if (!body?.password) {
    //   throw new UnauthorizedException('Please enter your password');
    // }

    const dtoObject = plainToInstance(ChangePasswordDTO, body);

    // Validate
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((err) => {
          return err?.constraints;
        }),
      });
    }

    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await hashPassword(body?.password);

    // const newUser = this.usersRepository.create({
    //   ...user,
    //   password: hashedPassword,
    // });

    const res = await this.usersRepository.update(
      { id: user?.id },
      { password: hashedPassword },
    );

    return {
      message: 'Password Changed Successfully',
    };
  }

  async refreshTokenService(request: Request) {
    try {
      // console.log('refresh req', request.headers.cookie?.split('=')[1]);

      const refreshToken = request.headers.cookie?.split('=')[1];

      const refreshPayload = await this.jwtService.verifyAsync(
        refreshToken as string,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET_KEY'), // In production, use ConfigService
        },
      );

      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      const payload = this.jwtService.decode(token as string);

      const { iat, exp, nbf, ...cleanPayload } = payload;
      const accessToken = await this.jwtService.signAsync(cleanPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_VALIDITY'),
      });

      return {
        access_token: accessToken,
      };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Your refresh token has expired. Please log in.',
        );
      }
      throw new UnauthorizedException(error?.message || 'Something went wrong');
    }
  }
}
