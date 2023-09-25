import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class RegisterUserDto extends LoginUserDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly isPrivacyConfirmed: boolean;
}
