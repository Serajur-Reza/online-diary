import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Record } from './records.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDTO } from './dto/create-record-dto';
import { UpdateRecordDTO } from './dto/update-record-dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AiAnalysisService } from '../ai-analysis/ai-analysis.service';
import { parseJsonResponse } from 'src/utils/json-parser';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
    private readonly aiService: AiAnalysisService,
  ) {}

  async getAllRecordsService(userId: number) {
    const res = await this.recordsRepository?.findBy({ userId });
    return res;
  }

  async getSingleRecordService(userId: number, id: number) {
    const res = await this.recordsRepository?.findOneBy({ userId, id });

    if (!res) {
      throw new Error('Record not found');
    }
    return res;
  }

  async createRecordService(userId: number, record: CreateRecordDTO) {
    const dtoObject = plainToInstance(CreateRecordDTO, record);

    // Validate
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((err) => {
          return err?.constraints;
        }),
      });
    }

    const analysis = await this.aiService.analyzeDiaryEntry(
      record?.description,
    );

    const sentiment = parseJsonResponse(analysis as string);

    // console.log('record analysis', parseJsonResponse(analysis as string));
    // return {};
    const res = await this.recordsRepository?.save({
      ...record,
      userId: userId,
      sentiment,
    });
    return res;
  }

  async updateRecordService(id: number, record: UpdateRecordDTO) {
    const dtoObject = plainToInstance(UpdateRecordDTO, record);

    // Validate
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map((err) => {
          return err?.constraints;
        }),
      });
    }
    const res = await this.recordsRepository?.findOneBy({ id });

    if (!res) {
      throw new NotFoundException('Record not found');
    }

    const analysis = await this.aiService.analyzeDiaryEntry(
      record?.description,
    );

    const sentiment = parseJsonResponse(analysis as string);
    await this.recordsRepository?.update(id, { ...record, sentiment });

    const updatedRecord = await this.recordsRepository?.findOneBy({ id });
    return updatedRecord;
  }

  async deleteRecordService(id: number) {
    const res = await this.recordsRepository?.findOneBy({ id });

    if (!res) {
      throw new NotFoundException('Record not found');
    }

    const deletedRecord = await this.recordsRepository?.delete(id);
    return res;
  }
}
