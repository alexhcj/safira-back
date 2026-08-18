import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class CreateGenericCategorySpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.GENERIC;
}
