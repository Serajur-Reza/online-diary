import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateRecordDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsDate()
  @IsOptional()
  readonly date: string;
}
