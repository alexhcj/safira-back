import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ShelfLifeUnitEnum } from '../../enums/shelf-life-unit.enum';

export class CreateShelfLifeDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(ShelfLifeUnitEnum)
  unit: ShelfLifeUnitEnum;
}
