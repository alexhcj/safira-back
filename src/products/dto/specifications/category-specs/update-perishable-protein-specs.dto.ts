import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';
import { FarmedOrWildEnum } from '../../../enums/farmed-or-wild.enum';

export class UpdatePerishableProteinSpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype?: SpecArchetype.PERISHABLE_PROTEIN;

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
