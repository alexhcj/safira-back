import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUnitSizeDto } from './create-unit-size.dto';
import { PricingUnitEnum } from '../../enums/pricing-unit.enum';

export class CreatePackagingDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly unitsPerPack?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUnitSizeDto)
  readonly unitSize?: CreateUnitSizeDto;

  @IsOptional()
  @IsString()
  readonly packagingType?: string;

  @IsOptional()
  @IsEnum(PricingUnitEnum)
  readonly pricingUnit?: PricingUnitEnum;
}
