import {
  BasicBeadAndLambSubCategoryEnum,
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

export type BasicCategoryType =
  | BasicBeerWineSpiritsSubCategoryEnum
  | BasicDrinksSubCategoryEnum
  | BasicDairyChilledAndEggsSubCategoryEnum
  | BasicFruitsSubCategoryEnum
  | BasicVegetablesSubCategoryEnum
  | BasicCannedFoodSubCategoryEnum
  | BasicBeadAndLambSubCategoryEnum
  | BasicFishAndSeaFoodSubCategoryEnum
  | BasicDriedFoodSubCategoryEnum
  | BasicOilSubCategoryEnum
  | BasicFrozenFoodSubCategoryEnum;
