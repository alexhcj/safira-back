import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OfferEnum } from '../enums/offer.enum';

export class OfferDto {
  @IsEnum(OfferEnum)
  readonly type: OfferEnum;

  @IsString()
  @IsNotEmpty()
  readonly img: string;

  @IsString()
  @IsNotEmpty()
  readonly description;
}
