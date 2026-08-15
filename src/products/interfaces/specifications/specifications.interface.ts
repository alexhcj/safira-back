import { ICompanyData } from './company.interface';
import { IShelfLife } from './shelf-life.interface';
import { IIngredient } from './ingredient.interface';
import { IStorageInformation } from './storage-information.interface';
import { INutritionalData } from './nutritional-data.interface';
import { ICategorySpecs } from './category-specs/category-specs.interface';

export interface ISpecifications {
  company: ICompanyData;
  producingCountry?: string;
  shelfLife: IShelfLife;
  ingredients: IIngredient[];
  storageInformation?: IStorageInformation;
  nutritionalData?: INutritionalData;
  categorySpecs?: ICategorySpecs;
}
