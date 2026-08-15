import { CreateCategorySpecsBaseDto } from './create-category-specs-base.dto';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { SpecArchetype } from '../../../enums/category-specs.enum';
import { PackingMediumEnum } from '../../../enums/packing-medium.enum';
import { CreateUnitSizeDto } from '../../packaging/create-unit-size.dto';
import { Type } from 'class-transformer';

export class CreatePreservedFoodSpecsDto extends CreateCategorySpecsBaseDto {
  declare readonly specArchetype: SpecArchetype.PRESERVED_FOOD;

  @IsOptional()
  @IsEnum(PackingMediumEnum)
  readonly packingMedium?: PackingMediumEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUnitSizeDto)
  readonly drainedWeight?: CreateUnitSizeDto;
}
