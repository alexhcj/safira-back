import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { FarmedOrWildEnum } from '../../../enums/farmed-or-wild.enum';

export class CreatePerishableProteinSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.PERISHABLE_PROTEIN;

  @IsOptional()
  @IsEnum(FarmedOrWildEnum)
  readonly farmedOrWild?: FarmedOrWildEnum;

  @IsOptional()
  @IsString()
  readonly cut?: string;

  @IsOptional()
  @IsBoolean()
  readonly isFrozen?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly boneIn?: boolean;
}
