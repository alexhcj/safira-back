import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';

export class CreateAlcoholicBeverageSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.ALCOHOLIC_BEVERAGE;

  @IsNumber()
  @Min(0)
  @Max(100)
  readonly abv: number;

  @IsOptional()
  @IsString()
  readonly beverageStyle?: string;

  @IsOptional()
  @IsString()
  readonly flavour?: string;
}
