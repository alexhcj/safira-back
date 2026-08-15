import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockQuantity: number;
}
