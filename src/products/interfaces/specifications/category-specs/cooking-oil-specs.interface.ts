import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { ExtractionMethod } from '../../../enums/extraction-method.enum';

export interface ICookingOilSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.COOKING_OIL;
  extractionMethod?: ExtractionMethod;
  oilType?: string;
  acidityPercent?: number;
}
