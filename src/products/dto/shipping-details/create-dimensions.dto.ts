import { LengthUnitEnum } from '../../enums/common.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDimensionsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly width: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly height: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly depth: number;

  @IsOptional()
  @IsEnum(LengthUnitEnum)
  readonly unit?: LengthUnitEnum;
}
