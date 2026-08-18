import { IShelfLife } from './shelf-life.interface';
import { IIngredient } from './ingredient.interface';
import { IStorageInformation } from './storage-information.interface';
import { INutritionalData } from './nutritional-data.interface';
import { ICategorySpecs } from './category-specs/category-specs.interface';
import { IBrand, IBrandRaw } from '../../../brands/interfaces/brand.interface';

export interface ISpecifications {
  brand: IBrand;
  producingCountry?: string;
  shelfLife: IShelfLife;
  ingredients?: IIngredient[];
  storageInformation?: IStorageInformation;
  nutritionalData?: INutritionalData;
  categorySpecs?: ICategorySpecs;
}

export interface ISpecificationsRaw {
  brand: IBrandRaw;
  producingCountry?: string;
  shelfLife: IShelfLife;
  ingredients?: IIngredient[];
  storageInformation?: IStorageInformation;
  nutritionalData?: INutritionalData;
  categorySpecs?: ICategorySpecs;
}
