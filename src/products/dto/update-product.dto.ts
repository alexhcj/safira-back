import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSpecificationsDto } from './specifications/update-specifications.dto';
import { UpdateInventoryDto } from './update-inventory.dto';
import { UpdatePriceDto } from '../../prices/dto/price.dto';
import { UpdatePackagingDto } from './packaging/update-packaging.dto';
import { UpdateShippingDetailsDto } from './shipping-details/update-shipping-details.dto';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly slug?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly excerpt?: string;

  @IsOptional()
  @ValidateNested()
  readonly price?: UpdatePriceDto;

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
  @IsNumber()
  readonly popularity?: number;

  @IsOptional()
  @IsNumber()
  readonly views?: number;

  @IsOptional()
  @IsString()
  readonly tags?: string;

  @IsOptional()
  @IsString()
  readonly reviews?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSpecificationsDto)
  readonly specifications?: UpdateSpecificationsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateInventoryDto)
  readonly inventory?: UpdateInventoryDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePackagingDto)
  readonly packaging?: UpdatePackagingDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateShippingDetailsDto)
  readonly shippingDetails?: UpdateShippingDetailsDto;
}
