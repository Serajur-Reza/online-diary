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

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private usersRepository: Repository<Record>,
  ) {}

  async getAllRecordsService(userId: number) {
    const res = await this.usersRepository?.findBy({ userId });
    return res;
  }

  async getSingleRecordService(userId: number, id: number) {
    const res = await this.usersRepository?.findOneBy({ userId, id });

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
    const res = await this.usersRepository?.save({
      ...record,
      userId: userId,
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
    const res = await this.usersRepository?.findOneBy({ id });

    if (!res) {
      throw new NotFoundException('Record not found');
    }
    await this.usersRepository?.update(id, record);

    const updatedRecord = await this.usersRepository?.findOneBy({ id });
    return updatedRecord;
  }

  async deleteRecordService(id: number) {
    const res = await this.usersRepository?.findOneBy({ id });

    if (!res) {
      throw new NotFoundException('Record not found');
    }

    const deletedRecord = await this.usersRepository?.delete(id);
    return res;
  }
}
