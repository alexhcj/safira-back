import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateIngredientDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly order: number;

  @IsOptional()
  @IsBoolean()
  readonly isAllergen?: boolean;
}
