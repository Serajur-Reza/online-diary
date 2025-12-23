// export class SignUpDTO {
//   name: string;
//   age: number;
//   breed: string;
// }

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  readonly username?: string;

  @IsString()
  @IsNotEmpty()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  readonly password?: string;

  @IsString()
  @IsNotEmpty()
  readonly role?: 'admin' | 'user';
}
