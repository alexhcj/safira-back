import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateNutrientEntryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly unit: string;
}
