import { LengthUnitEnum } from '../../enums/common.enum';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDimensionsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly width?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly height?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly depth?: number;

  @IsOptional()
  @IsEnum(LengthUnitEnum)
  readonly unit?: LengthUnitEnum;
}
