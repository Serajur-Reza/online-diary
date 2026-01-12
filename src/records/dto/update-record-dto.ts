import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsDateString({}, { message: 'Date should be of this format yyyy-mm-dd' })
  @IsOptional()
  readonly date: string;
}
