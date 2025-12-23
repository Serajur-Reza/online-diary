import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDTO } from './dto/signup-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { LoginDTO } from './dto/login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { hashPassword, matchPassword } from 'src/utils/passwordUtils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  getAllUsersService() {
    return [];
  }

  getSingleUserService(id: string) {
    return '';
  }

  async signUpService(user: SignUpDTO) {
    const hashedPassword = await hashPassword(user?.password);

    console.log('hashed', hashedPassword);

    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });

    const res = await this.usersRepository.save(newUser);

    console.log('signup', res);
    return res;
  }

  async loginService(user: LoginDTO) {
    const email = user?.email;
    const singleUser = await this.usersRepository?.findOne(email);

    console.log('singleUser', singleUser);

    const matched = await matchPassword(user?.password);

    if (!matched) {
      throw new UnauthorizedException('Password is wrong');
    }
  }

  updateUserService(id: string, user: UpdateUserDTO) {
    return '';
  }

  deleteUserService(id: string) {
    return '';
  }
}
