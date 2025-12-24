import { LoginDTO } from './dto/login-dto';
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
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsersController() {
    try {
      const res = this.usersService.getAllUsersService();
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  getSingleUserController(@Param('id') id: string) {
    try {
      const res = this.usersService.getSingleUserService(id);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @Post()
  signUpController(@Body() user: SignUpDTO) {
    try {
      const res = this.usersService.signUpService(user);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  updateUserController(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    try {
      const res = this.usersService.updateUserService(id, user);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  deleteUserController(@Param('id') id: string) {
    try {
      const res = this.usersService.deleteUserService(id);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }
}
