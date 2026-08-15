import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';

export class UpdateAlcoholicBeverageSpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype?: SpecArchetype.ALCOHOLIC_BEVERAGE;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly abv?: number;

  @IsOptional()
  @IsString()
  readonly beverageStyle?: string;

  @IsOptional()
  @IsString()
  readonly flavour?: string;
}
