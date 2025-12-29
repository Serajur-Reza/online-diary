import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateRecordDTO {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  readonly description: string;

  @IsNotEmpty({ message: 'Date cannot be empty' })
  @IsDateString({}, { message: 'Date should be of this format yyyy-mm-dd' })
  readonly date: string;
}
