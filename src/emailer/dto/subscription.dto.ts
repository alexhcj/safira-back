import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { UnsubscribeReasonEnum } from '../enums/unsubscribe.enum';

export class SubscribeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class SubscribeUserRO {
  message: string;
  statusCode: HttpStatus;
}

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

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

  @IsOptional()
  @IsString()
  unsubReason?: string;

  @IsOptional()
  @IsString()
  unsubFeedback?: string;
}

export class UpdateSubscriptionRO {
  message: string;
  statusCode: HttpStatus;
}

export class UnsubscribeUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsObject()
  campaigns: UpdateSubscriptionDto;
}

export class UnsubscribeUserRO {
  message: string;
  statusCode: HttpStatus;
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

  @IsNotEmpty()
  @IsString()
  unsubLink: string;
}

export class SendSubscribedSuccessRO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(HttpStatus)
  statusCode: HttpStatus;
}

export class SendSubscribedOnboardDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  unsubLink: string;
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

export class CreateFeedbackDto {
  @IsNotEmpty()
  @Transform(({ value }) => {
    const reasonMap: Record<string, UnsubscribeReasonEnum> = {
      'Too many emails': UnsubscribeReasonEnum.TOO_MANY_EMAILS,
      'Content not relevant to me':
        UnsubscribeReasonEnum.CONTENT_NOT_RELEVANT_TO_ME,
      'Found better alternatives':
        UnsubscribeReasonEnum.FOUND_BETTER_ALTERNATIVES,
      'No longer interested in this topic':
        UnsubscribeReasonEnum.NO_LONGER_INTERESTED_IN_THIS_TOPIC,
      'Email too frequent': UnsubscribeReasonEnum.EMAIL_TOO_FREQUENT,
      'Content quality issues': UnsubscribeReasonEnum.CONTENT_QUALITY_ISSUES,
      'Other reason': UnsubscribeReasonEnum.OTHER_REASON,
    };

    return reasonMap[value] || value;
  })
  @IsEnum(UnsubscribeReasonEnum)
  unsubReason: UnsubscribeReasonEnum;

  @IsOptional()
  @IsString()
  unsubFeedback: string;
}

export class CreateFeedbackRO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsEnum(HttpStatus)
  statusCode: HttpStatus;
}
