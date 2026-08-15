import { IGenericCategorySpecs } from './generic-category-specs.interface';
import { IAlcoholicBeverageSpecs } from './alcoholic-beverage-specs.interface';
import { INonAlcoholicBeverageSpecs } from './non-alcoholic-beverage-specs.interface';
import { IPerishableProteinSpecs } from './perishable-protein-specs.interface';
import { IPackagedCountSpecs } from './packaged-count-specs.interface';
import { ICookingOilSpecs } from './cooking-oil-specs.interface';
import { IPreservedFoodSpecs } from './preserved-food-specs.interface';

export type ICategorySpecs =
  | IGenericCategorySpecs
  | IAlcoholicBeverageSpecs
  | INonAlcoholicBeverageSpecs
  | IPerishableProteinSpecs
  | IPackagedCountSpecs
  | ICookingOilSpecs
  | IPreservedFoodSpecs;
