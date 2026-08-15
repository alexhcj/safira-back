import { IsBoolean, IsOptional } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';

export class UpdateNonAlcoholicBeverageSpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.NON_ALCOHOLIC_BEVERAGE;

  @IsOptional()
  @IsBoolean()
  readonly isFromConcentrate?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly addedSugar?: boolean;
}
