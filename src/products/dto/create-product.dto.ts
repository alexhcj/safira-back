import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import {
  AllBasicCategoryValues,
  BasicCategoryType,
} from '../interfaces/category.interface';
import { CreateSpecificationsDto } from './specifications.dto';
import { Type } from 'class-transformer';
import { TagsDto } from '../../tags/dto/tags.dto';
import { SlugEnum } from '../../common/decorators/slug-enum.decorator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNumber()
  readonly discount_price?: number;

  @IsOptional()
  @SlugEnum(PrimeCategoryEnum)
  readonly primeCategory?: PrimeCategoryEnum;

  @IsOptional()
  @SlugEnum(SubCategoryEnum)
  readonly subCategory?: SubCategoryEnum;

  @IsNotEmpty()
  @IsIn(AllBasicCategoryValues)
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
