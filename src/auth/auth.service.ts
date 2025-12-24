// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/users/dto/login-dto';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(body: LoginDTO) {
    const user = await this.usersRepository.findOneBy({ email: body?.email });

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(body?.password, user?.password);
    if (!isMatch) throw new UnauthorizedException();

    const payload = { ...user };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
