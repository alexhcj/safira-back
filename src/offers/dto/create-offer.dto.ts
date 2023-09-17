import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OfferEnum } from '../enums/offer.enum';

export class CreateOfferDto {
  @IsEnum(OfferEnum)
  @IsNotEmpty()
  readonly type: OfferEnum;

  @IsString()
  readonly expiresDate: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  upTitle?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  deal?: string;
}
