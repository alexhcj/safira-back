import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { ExtractionMethod } from '../../../enums/extraction-method.enum';

export class CreateCookingOilSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.COOKING_OIL;

  @IsOptional()
  @IsEnum(ExtractionMethod)
  readonly extractionMethod?: ExtractionMethod;

  @IsOptional()
  @IsString()
  readonly oilType?: string;

  @IsOptional()
  @IsNumber()
  readonly acidityPercent?: number;
}
