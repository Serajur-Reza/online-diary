import { IsDate, IsString } from 'class-validator';

export class UpdateRecordDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsString()
  @IsDate()
  readonly date: string;
}
