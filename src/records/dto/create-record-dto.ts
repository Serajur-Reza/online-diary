import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecordDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  readonly date: string;
}
