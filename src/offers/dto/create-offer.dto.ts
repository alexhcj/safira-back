import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OfferEnum } from '../enums/offer.enum';
import { ILink } from '../interfaces/link.interface';

export class CreateOfferDto {
  @IsEnum(OfferEnum)
  @IsNotEmpty()
  readonly type: OfferEnum;

  @IsString()
  readonly expiresDate: string;

  @IsOptional()
  readonly link?: ILink;

  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly upTitle?: string;

  @IsOptional()
  @IsString()
  readonly text?: string;

  @IsOptional()
  @IsString()
  readonly img?: string;

  @IsOptional()
  @IsString()
  readonly deal?: string;
}
