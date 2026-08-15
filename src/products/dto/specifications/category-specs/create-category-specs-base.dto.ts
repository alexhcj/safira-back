import { IsDefined, IsEnum } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class CreateCategorySpecsBaseDto {
  @IsDefined()
  @IsEnum(SpecArchetype)
  readonly specArchetype: SpecArchetype;
}
