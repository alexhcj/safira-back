import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { PackingMediumEnum } from '../../../enums/packing-medium.enum';
import { IUnitSize } from '../../packaging/unit-size.interface';

export interface IPreservedFoodSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.PRESERVED_FOOD;
  packingMedium?: PackingMediumEnum;
  drainedWeight?: IUnitSize;
}
