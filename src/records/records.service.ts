import { Injectable } from '@nestjs/common';
import { Record } from './records.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDTO } from './dto/create-record-dto';
import { UpdateRecordDTO } from './dto/update-record-dto';

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
    const res = await this.usersRepository?.save({
      ...record,
      userId: userId,
    });
    return res;
  }

  async updateRecordService(id: number, record: UpdateRecordDTO) {
    const res = await this.usersRepository?.update(id, record);
    return res;
  }

  async deleteRecordService(id: number) {
    const res = await this.usersRepository?.delete(id);
    return res;
  }
}
