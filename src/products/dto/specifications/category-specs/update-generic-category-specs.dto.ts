import { SpecArchetype } from '../../../enums/category-specs.enum';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';

export class UpdateGenericCategorySpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype?: SpecArchetype.GENERIC;
}
