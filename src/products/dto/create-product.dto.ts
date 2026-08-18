import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TagsDto } from '../../tags/dto/tags.dto';
import { CreatePriceDto } from '../../prices/dto/price.dto';
import { CreateSpecificationsDto } from './specifications/create-specifications.dto';
import { CreateInventoryDto } from './create-inventory.dto';
import { CreatePackagingDto } from './packaging/create-packaging.dto';
import { CreateShippingDetailsDto } from './shipping-details/create-shipping-details.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNotEmpty()
  @IsString()
  readonly excerpt: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreatePriceDto)
  readonly price: CreatePriceDto;

  @IsNotEmpty()
  @IsString()
  readonly primeCategory: string;

  @IsOptional()
  @IsString()
  readonly subCategory?: string;

  @IsOptional()
  @IsString()
  readonly basicCategory: string;

  @IsOptional()
  @IsString()
  readonly popularity: number;

  @IsOptional()
  @IsNumber()
  readonly views: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => TagsDto)
  readonly tags: TagsDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateSpecificationsDto)
  readonly specifications: CreateSpecificationsDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateInventoryDto)
  readonly inventory: CreateInventoryDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreatePackagingDto)
  readonly packaging: CreatePackagingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateShippingDetailsDto)
  readonly shippingDetails?: CreateShippingDetailsDto;
}
