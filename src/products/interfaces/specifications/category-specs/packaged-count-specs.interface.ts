import { ICategorySpecsBase } from './category-specs-base.interface';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export interface IPackagedCountSpecs extends ICategorySpecsBase {
  specArchetype: SpecArchetype.PACKAGED_COUNT;
  gradeOrSize?: string;
}
