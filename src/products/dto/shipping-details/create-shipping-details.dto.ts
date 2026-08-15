import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDimensionsDto } from './create-dimensions.dto';
import { CreateUnitSizeDto } from '../packaging/create-unit-size.dto';

export class CreateShippingDetailsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUnitSizeDto)
  readonly weight?: CreateUnitSizeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDimensionsDto)
  readonly dimensions?: CreateDimensionsDto;
}
