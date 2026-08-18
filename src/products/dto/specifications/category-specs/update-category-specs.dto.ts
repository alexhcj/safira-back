import { IsEnum, IsOptional } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class UpdateCategorySpecsBaseDto {
  @IsOptional()
  @IsEnum(SpecArchetype)
  readonly specArchetype?: SpecArchetype;
}
