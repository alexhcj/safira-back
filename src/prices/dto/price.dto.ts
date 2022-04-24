import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly discount_price: number;
}
