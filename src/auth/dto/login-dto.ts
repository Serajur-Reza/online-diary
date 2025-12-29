import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: 'Please enter an email address' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a password' })
  readonly password: string;
}
