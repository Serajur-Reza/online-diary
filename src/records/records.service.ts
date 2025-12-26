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

  async getAllRecordsService() {
    const res = await this.usersRepository?.find();
    return res;
  }

  async getSingleRecordService(id: number) {
    const res = await this.usersRepository?.findOneBy({ id });
    return res;
  }

  async createRecordService(userId: number, record: CreateRecordDTO) {
    console.log('create record', record);
    const newRecord = this.usersRepository.create({
      ...record,
      // user: userId,
    });
    const res = await this.usersRepository?.save(newRecord);
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
