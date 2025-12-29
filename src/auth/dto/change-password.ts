import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty({ message: 'Please enter an email address' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a password' })
  @MinLength(4, {
    message: 'Password must be at least 4 characters long', // Custom error message (optional)
  })
  readonly password: string;
}
