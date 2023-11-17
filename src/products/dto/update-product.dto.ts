import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSpecificationsDto } from './specifications.dto';
import { Types } from 'mongoose';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly slug?: string;

  @IsOptional()
  @IsObject()
  readonly price?: {
    price: number;
    discount_price?: number;
  };

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly primeCategory?: string;

  @IsOptional()
  @IsString()
  readonly subCategory?: string;

  @IsOptional()
  @IsString()
  readonly basicCategory?: string;

  @IsOptional()
  @IsString()
  readonly popularity?: string;

  @IsOptional()
  @IsNumber()
  readonly views?: number;

  @IsOptional()
  @IsString()
  readonly tags?: string;

  @IsOptional()
  @IsNotEmpty()
  readonly reviews?: Types.ObjectId;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSpecificationsDto)
  readonly specifications?: UpdateSpecificationsDto;
}
