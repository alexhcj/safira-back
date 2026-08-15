import {
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUnitSizeDto } from '../packaging/create-unit-size.dto';
import { CreateMacroBreakdownDto } from './create-macro-breakdown.dto';
import { CreateNutrientEntryDto } from './create-nutrient-entry.dto';

export class CreateNutritionalDataDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateUnitSizeDto)
  readonly servingSize: CreateUnitSizeDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly energyKcal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly protein?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMacroBreakdownDto)
  readonly fat?: CreateMacroBreakdownDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMacroBreakdownDto)
  readonly carbohydrate?: CreateMacroBreakdownDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly sodium?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly cholesterol?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateNutrientEntryDto)
  readonly micronutrients: CreateNutrientEntryDto[];
}
