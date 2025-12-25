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
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDTO } from 'src/users/dto/update-user-dto';
import { CreateRecordDTO } from './dto/create-record-dto';
import { UpdateRecordDTO } from './dto/update-record-dto';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllRecordsController() {
    try {
      const res = await this.recordsService.getAllRecordsService();
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getSingleRecordController(@Param('id') id: number) {
    try {
      const res = await this.recordsService.getSingleRecordService(id);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createRecordController(@Body() record: CreateRecordDTO) {
    try {
      const res = await this.recordsService.createRecordService(record);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateRecordController(
    @Param('id') id: number,
    @Body() record: UpdateRecordDTO,
  ) {
    try {
      const res = await this.recordsService.updateRecordService(id, record);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteRecordController(@Param('id') id: number) {
    try {
      const res = await this.recordsService.deleteRecordService(id);
      return res;
    } catch (error) {
      throw new HttpException(
        'Server Error',
        error?.message || HttpStatus?.BAD_REQUEST,
      );
    }
  }
}
