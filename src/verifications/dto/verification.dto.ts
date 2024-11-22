import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivacyConfirmed: boolean;

  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @IsDate()
  codeCreatedAt: Date;
}

export class CreateVerificationRO {
  message: HttpStatus;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;
}

export class VerifyEmailRO {
  message: HttpStatus;
}

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ChangeEmailRO {
  message: HttpStatus;
}

export class VerifyNewEmailDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}

export class VerifyNewEmailRO {
  message: HttpStatus;
}

export class ValidatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ValidatePasswordRO {
  message: HttpStatus;
}
