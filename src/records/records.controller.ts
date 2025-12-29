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
  getAllRecordsController(@Request() req) {
    const userId: number = req?.user?.id as number;
    return this.recordsService.getAllRecordsService(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getSingleRecordController(@Request() req, @Param('id') id: number) {
    const userId: number = req?.user?.id as number;
    return this.recordsService.getSingleRecordService(userId, id);
  }

  @UseGuards(AuthGuard)
  @Post()
  createRecordController(@Request() req, @Body() record: CreateRecordDTO) {
    const userId: number = req?.user?.id as number;
    return this.recordsService.createRecordService(userId, record);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateRecordController(
    @Param('id') id: number,
    @Body() record: UpdateRecordDTO,
  ) {
    return this.recordsService.updateRecordService(id, record);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteRecordController(@Param('id') id: number) {
    return this.recordsService.deleteRecordService(id);
  }
}
