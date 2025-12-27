// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/dto/login-dto';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDTO } from './dto/change-password';
import { hashPassword } from 'src/utils/passwordUtils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginService(body: LoginDTO) {
    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(body?.password, user?.password);
    if (!isMatch) throw new UnauthorizedException();

    // const accessExpiresIn =
    //    ?? '30m';

    const payload = { ...user };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'jgvklanaiovnrioa',
      expiresIn: '30m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'gaioeanvkapranoa',
      expiresIn: '30m',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async changePasswordService(body: ChangePasswordDTO) {
    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) throw new UnauthorizedException();

    const hashedPassword = await hashPassword(body?.password);

    // const newUser = this.usersRepository.create({
    //   ...user,
    //   password: hashedPassword,
    // });

    const res = await this.usersRepository.update(
      { id: user?.id },
      { password: hashedPassword },
    );

    console.log(res);

    return {
      message: 'Password Changed Successfully',
    };
  }
}
