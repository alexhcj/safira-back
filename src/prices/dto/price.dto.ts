import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePriceDto {
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNumber()
  readonly discountPrice?: number;
}

export class UpdatePriceDto {
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsNumber()
  readonly discountPrice?: number;
}
