import {
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateMacroBreakdownDto } from './update-macro-breakdown.dto';
import { UpdateNutrientEntryDto } from './update-nutrient-entry.dto';
import { UpdateUnitSizeDto } from '../packaging/update-unit-size.dto';

export class UpdateNutritionalDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUnitSizeDto)
  readonly servingSize?: UpdateUnitSizeDto;

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
  @Type(() => UpdateMacroBreakdownDto)
  readonly fat?: UpdateMacroBreakdownDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateMacroBreakdownDto)
  readonly carbohydrate?: UpdateMacroBreakdownDto;

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
  @ValidateNested({ each: true })
  @Type(() => UpdateNutrientEntryDto)
  readonly micronutrients?: UpdateNutrientEntryDto[];
}
