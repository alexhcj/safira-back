import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import {
  MassUnitEnum,
  UnitEnumValues,
  VolumeUnitEnum,
} from '../../enums/common.enum';

export class UpdateUnitSizeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly value?: number;

  @IsOptional()
  @IsIn(UnitEnumValues)
  readonly unit?: MassUnitEnum | VolumeUnitEnum;
}
