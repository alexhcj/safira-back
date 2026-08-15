import { IsDefined, IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';
import {
  MassUnitEnum,
  UnitEnumValues,
  VolumeUnitEnum,
} from '../../enums/common.enum';

export class CreateUnitSizeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly value: number;

  @IsDefined()
  @IsIn(UnitEnumValues)
  readonly unit: MassUnitEnum | VolumeUnitEnum;
}
