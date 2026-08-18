import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export interface IAlcoholicBeverageSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.ALCOHOLIC_BEVERAGE;
  abv: number;
  beverageStyle?: string;
  flavour?: string;
}
