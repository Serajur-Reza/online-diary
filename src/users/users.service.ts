import { Injectable } from '@nestjs/common';
import { SignUpDTO } from './dto/signup-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { LoginDTO } from '../auth/dto/login-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { hashPassword } from 'src/utils/passwordUtils';

@Injectable()
export class UsersService {
  findOneBy: any;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // private jwtService: JwtService,
  ) {}
  async getAllUsersService() {
    const res = await this.usersRepository?.find();
    return res;
  }

  getSingleUserService(id: string) {
    return '';
  }

  async signUpService(user: SignUpDTO) {
    const hashedPassword = await hashPassword(user?.password);

    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });

    const res = await this.usersRepository.save(newUser);
    return res;
  }

  updateUserService(id: number, user: UpdateUserDTO) {
    console.log('user update', id, user);
    return '';
  }

  deleteUserService(id: string) {
    return '';
  }
}
