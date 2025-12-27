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
import { RecordsService } from './records.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateRecordDTO } from './dto/create-record-dto';
import { UpdateRecordDTO } from './dto/update-record-dto';

@Controller('records')
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllRecordsController(@Request() req) {
    try {
      const userId: number = req?.user?.id as number;
      const res = await this.recordsService.getAllRecordsService(userId);
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
  async getSingleRecordController(@Request() req, @Param('id') id: number) {
    try {
      const userId: number = req?.user?.id as number;
      const res = await this.recordsService.getSingleRecordService(userId, id);
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
  async createRecordController(
    @Request() req,
    @Body() record: CreateRecordDTO,
  ) {
    try {
      const userId: number = req?.user?.id as number;
      const res = await this.recordsService.createRecordService(userId, record);
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
