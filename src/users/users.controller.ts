import { AuthGuard } from 'src/auth/auth.guard';
import { LoginDTO } from '../auth/dto/login-dto';
import { SignUpDTO } from './dto/signup-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsersController() {
    const res = await this.usersService.getAllUsersService();
    return res;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getSingleUserController(@Request() req) {
    return req?.user;
  }

  @Post()
  async signUpController(@Body() user: SignUpDTO) {
    return await this.usersService.signUpService(user);
  }

  // @UseGuards(AuthGuard)
  // @Patch(':id')
  // updateUserController(@Param('id') id: number, @Body() user: UpdateUserDTO) {
  //   try {
  //     const res = this.usersService.updateUserService(id, user);
  //     return res;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Server Error',
  //       error?.message || HttpStatus?.BAD_REQUEST,
  //     );
  //   }
  // }

  // @Delete(':id')
  // deleteUserController(@Param('id') id: string) {
  //   try {
  //     const res = this.usersService.deleteUserService(id);
  //     return res;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Server Error',
  //       error?.message || HttpStatus?.BAD_REQUEST,
  //     );
  //   }
  // }
}
