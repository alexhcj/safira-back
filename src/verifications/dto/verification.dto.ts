import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { VerifyEmailTemplateIdEnum } from '../../emailer/enums/emailer.enum';
import { Transform } from 'class-transformer';
import { AuthLoginRO } from '../../auth/interfaces/auth.interface';

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
  statusCode: HttpStatus;
}

export class ResendVerifyEmailDto {
  @IsNotEmpty()
  @Transform(({ value }) => VerifyEmailTemplateIdEnum[value])
  @IsEnum(VerifyEmailTemplateIdEnum, { message: 'Enum should be correct.' })
  type: VerifyEmailTemplateIdEnum;
}

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ChangeEmailRO {
  statusCode: HttpStatus;
}

export class VerifyNewEmailDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}

export class VerifyNewEmailRO {
  statusCode: HttpStatus;
}

export class ValidatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ValidatePasswordRO {
  statusCode: HttpStatus;
  creds: AuthLoginRO;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class ChangePasswordRO {
  statusCode: HttpStatus;
}

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}

export class VerifyCodeRO {
  statusCode: HttpStatus;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class ResetPasswordRO {
  statusCode: HttpStatus;
}
