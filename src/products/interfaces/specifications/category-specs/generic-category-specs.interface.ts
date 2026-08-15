import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export interface IGenericCategorySpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.GENERIC;
}
