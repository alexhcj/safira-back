import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { PackingMediumEnum } from '../../../enums/packing-medium.enum';
import { CreateUnitSizeDto } from '../../packaging/create-unit-size.dto';
import { UpdateCategorySpecsBaseDto } from './update-category-specs.dto';
import { Type } from 'class-transformer';

export class UpdatePreservedFoodSpecsDto extends UpdateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.PRESERVED_FOOD;

  @IsOptional()
  @IsEnum(PackingMediumEnum)
  readonly packingMedium?: PackingMediumEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUnitSizeDto)
  readonly drainedWeight?: CreateUnitSizeDto;
}
