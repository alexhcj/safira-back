import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from '../interfaces/category.interface';
import { CreateSpecificationsDto } from './specifications.dto';
import { Type } from 'class-transformer';
import { TagsDto } from '../../tags/dto/tags.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @IsOptional()
  readonly discount_price?: number;

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

  @IsOptional()
  @IsString()
  readonly producingCountry: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TagsDto)
  readonly tags: TagsDto;

  @ValidateNested()
  @Type(() => CreateSpecificationsDto)
  readonly specifications: CreateSpecificationsDto;
}
