import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export interface IPerishableProteinSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.PERISHABLE_PROTEIN;
  cut?: string;
  isFrozen?: boolean;
  boneIn?: boolean;
}
