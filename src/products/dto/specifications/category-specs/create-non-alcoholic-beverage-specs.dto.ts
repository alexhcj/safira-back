import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class CreateNonAlcoholicBeverageSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.NON_ALCOHOLIC_BEVERAGE;

  @IsOptional()
  @IsBoolean()
  readonly isFromConcentrate?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly addedSugar?: boolean;
}
