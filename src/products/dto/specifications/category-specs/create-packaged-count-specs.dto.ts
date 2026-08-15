import { IsOptional, IsString } from 'class-validator';
import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class CreatePackagedCountSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.PACKAGED_COUNT;

  @IsOptional()
  @IsString()
  readonly gradeOrSize?: string;
}
