import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export class SubscribeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class SubscribeUserRO {
  message: HttpStatus;
}

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsBoolean()
  devNews?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingNews?: boolean;

  @IsOptional()
  @IsBoolean()
  blogNews?: boolean;
}

export class UpdateSubscriptionRO {
  message: HttpStatus;
}

export class UnsubscribeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class UnsubscribeUserRO {
  message: HttpStatus;
}

export class SendSubscribedSuccessDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  profileLink: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class SendSubscribedSuccessRO {
  @IsNotEmpty()
  @IsEnum(HttpStatus)
  message: HttpStatus;
}

export class SendSubscribedOnboardRO {
  @IsNotEmpty()
  @IsEnum(HttpStatus)
  message: HttpStatus;
}

export class SendSubscribedAuthorRO {
  @IsNotEmpty()
  @IsEnum(HttpStatus)
  message: HttpStatus;
}

export class SendWeeklyProductsRO {
  @IsNotEmpty()
  @IsEnum(HttpStatus)
  message: HttpStatus;
}
