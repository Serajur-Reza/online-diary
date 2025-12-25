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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async loginService(body: LoginDTO) {
    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(body?.password, user?.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { ...user };
    return {
      access_token: await this.jwtService.signAsync(payload),
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
