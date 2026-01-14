import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Record } from './records.entity';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Record]), AiAnalysisModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
