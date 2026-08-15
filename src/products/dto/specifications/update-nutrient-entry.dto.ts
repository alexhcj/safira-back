import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateNutrientEntryDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly amount?: number;

  @IsOptional()
  @IsString()
  readonly unit?: string;
}
