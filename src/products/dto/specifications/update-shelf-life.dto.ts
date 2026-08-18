import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ShelfLifeUnitEnum } from '../../enums/shelf-life-unit.enum';

export class UpdateShelfLifeDto {
  @IsOptional()
  @IsNumber()
  readonly value: number;

  @IsOptional()
  @IsEnum(ShelfLifeUnitEnum)
  readonly unit: ShelfLifeUnitEnum;
}
