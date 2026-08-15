import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export interface INonAlcoholicBeverageSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.NON_ALCOHOLIC_BEVERAGE;
  isFromConcentrate?: boolean;
  addedSugar?: boolean;
}
