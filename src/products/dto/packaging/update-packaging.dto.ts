import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUnitSizeDto } from './update-unit-size.dto';
import { PricingUnitEnum } from '../../enums/pricing-unit.enum';

export class UpdatePackagingDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly unitsPerPack?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUnitSizeDto)
  readonly unitSize?: UpdateUnitSizeDto;

  @IsOptional()
  @IsString()
  readonly packagingType?: string;

  @IsOptional()
  @IsEnum(PricingUnitEnum)
  readonly pricingUnit?: PricingUnitEnum;
}
