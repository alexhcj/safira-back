import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UserDBDto {
  readonly email: string;
  readonly passwordHash: string;
}
