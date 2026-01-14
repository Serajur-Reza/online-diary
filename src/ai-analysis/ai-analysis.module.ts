import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiAnalysisService } from './ai-analysis.service';

@Module({
  imports: [ConfigModule], // To access your API Keys
  providers: [AiAnalysisService],
  exports: [AiAnalysisService], // THIS IS KEY: It allows other modules to use it
})
export class AiAnalysisModule {}
