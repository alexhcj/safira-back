import { IUnitSize } from '../packaging/unit-size.interface';
import { INutrientEntry } from './nutrient-entry.interface';
import { IMacroBreakdown } from './macro-breakdown.interface';

export class INutritionalData {
  servingSize: IUnitSize;
  energyKcal?: number;
  protein?: number;
  fat?: IMacroBreakdown;
  carbohydrate?: IMacroBreakdown;
  sodium?: number;
  cholesterol?: number;
  micronutrients: INutrientEntry[];
}
