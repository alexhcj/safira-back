import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from '../interfaces/category.interface';
import { CreateSpecificationsDto } from './specifications.dto';
import { Type } from 'class-transformer';

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
  readonly popularity: number;

  @IsOptional()
  @IsNumber()
  readonly views: number;

  @IsString()
  @IsNotEmpty()
  readonly company: string;

  @IsOptional()
  @IsString()
  readonly producingCountry: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @ValidateNested()
  @Type(() => CreateSpecificationsDto)
  readonly specifications: CreateSpecificationsDto;
}
