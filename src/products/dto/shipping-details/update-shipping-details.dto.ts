import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUnitSizeDto } from '../packaging/update-unit-size.dto';
import { UpdateDimensionsDto } from './update-dimensions.dto';

export class UpdateShippingDetailsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUnitSizeDto)
  readonly weight?: UpdateUnitSizeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDimensionsDto)
  readonly dimensions?: UpdateDimensionsDto;
}
