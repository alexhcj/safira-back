import {
  BasicBeefAndLambSubCategoryEnum,
  BasicBeerWineSpiritsSubCategoryEnum,
  BasicCannedFoodSubCategoryEnum,
  BasicDairyChilledAndEggsSubCategoryEnum,
  BasicDriedFoodSubCategoryEnum,
  BasicDrinksSubCategoryEnum,
  BasicFishAndSeaFoodSubCategoryEnum,
  BasicFrozenFoodSubCategoryEnum,
  BasicFruitsSubCategoryEnum,
  BasicOilSubCategoryEnum,
  BasicVegetablesSubCategoryEnum,
} from '../enums/categories.enum';
import { toSlug } from '../../common/utils';

export type BasicCategoryType =
  | BasicBeerWineSpiritsSubCategoryEnum
  | BasicDrinksSubCategoryEnum
  | BasicDairyChilledAndEggsSubCategoryEnum
  | BasicFruitsSubCategoryEnum
  | BasicVegetablesSubCategoryEnum
  | BasicCannedFoodSubCategoryEnum
  | BasicBeefAndLambSubCategoryEnum
  | BasicFishAndSeaFoodSubCategoryEnum
  | BasicDriedFoodSubCategoryEnum
  | BasicOilSubCategoryEnum
  | BasicFrozenFoodSubCategoryEnum;

export const AllBasicCategoryValues: string[] = [
  ...Object.values(BasicBeerWineSpiritsSubCategoryEnum),
  ...Object.values(BasicDrinksSubCategoryEnum),
  ...Object.values(BasicDairyChilledAndEggsSubCategoryEnum),
  ...Object.values(BasicFruitsSubCategoryEnum),
  ...Object.values(BasicVegetablesSubCategoryEnum),
  ...Object.values(BasicCannedFoodSubCategoryEnum),
  ...Object.values(BasicBeefAndLambSubCategoryEnum),
  ...Object.values(BasicFishAndSeaFoodSubCategoryEnum),
  ...Object.values(BasicDriedFoodSubCategoryEnum),
  ...Object.values(BasicOilSubCategoryEnum),
  ...Object.values(BasicFrozenFoodSubCategoryEnum),
];

export const SlugToBasicCategoryMap: Record<string, string> = {};

AllBasicCategoryValues.forEach((val) => {
  SlugToBasicCategoryMap[toSlug(val)] = val;
});
