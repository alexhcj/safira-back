import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from '../interfaces/category.interface';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsObject()
  @IsNotEmpty()
  readonly price: {
    price: number;
    discount_price?: number;
  };

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsOptional()
  @IsEnum(PrimeCategoryEnum)
  @IsNotEmpty()
  readonly primeCategory?: PrimeCategoryEnum;

  @IsOptional()
  @IsEnum(SubCategoryEnum)
  @IsNotEmpty()
  readonly subCategory?: SubCategoryEnum;

  @IsString()
  @IsNotEmpty()
  readonly basicCategory: BasicCategoryType;

  @IsOptional()
  @IsString()
  readonly popularity: string;

  @IsOptional()
  @IsNumber()
  readonly views: number;

  @IsOptional()
  @IsNumber()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly company: string;

  @IsOptional()
  @IsString()
  readonly producingCountry: string;

  @IsString()
  @IsNotEmpty()
  readonly shelfLife: string;

  @IsOptional()
  @IsString()
  readonly tags?: string;
}
