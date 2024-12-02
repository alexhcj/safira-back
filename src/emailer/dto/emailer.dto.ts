import { VerifyEmailTemplateIdEnum } from '../enum/emailer.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @Transform(({ value }) => VerifyEmailTemplateIdEnum[value])
  @IsEnum(VerifyEmailTemplateIdEnum)
  type: VerifyEmailTemplateIdEnum;
}
