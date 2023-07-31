import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OfferEnum } from '../enums/offer.enum';

export class CreateOfferDto {
  @IsEnum(OfferEnum)
  @IsNotEmpty()
  readonly type: OfferEnum;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  upTitle?: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly img: string;
}
