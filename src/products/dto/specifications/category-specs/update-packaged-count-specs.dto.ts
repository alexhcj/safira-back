import { IsOptional, IsString } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';

export class UpdatePackagedCountSpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype?: SpecArchetype.PACKAGED_COUNT;

  @IsOptional()
  @IsString()
  readonly gradeOrSize?: string;
}
