import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateShelfLifeDto } from './update-shelf-life.dto';
import { UpdateCompanyDataDto } from '../update-company-data.dto';
import { UpdateIngredientDto } from './update-ingredient.dto';
import { UpdateStorageInformationDto } from './update-storage-information.dto';
import { UpdateNutritionalDataDto } from './update-nutritional-data.dto';
import { SpecArchetype } from '../../enums/category-specs.enum';
import { TUpdateCategorySpecsDto } from './category-specs/category-specs.dto-type';
import { UpdateCategorySpecsBaseDto } from './category-specs/update-category-specs.dto';
import { UpdateGenericCategorySpecsDto } from './category-specs/update-generic-category-specs.dto';
import { UpdateAlcoholicBeverageSpecsDto } from './category-specs/update-alcoholic-beverage-specs.dto';
import { UpdatePerishableProteinSpecsDto } from './category-specs/update-perishable-protein-specs.dto';
import { UpdatePackagedCountSpecsDto } from './category-specs/update-packaged-count-specs.dto';

export class UpdateSpecificationsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCompanyDataDto)
  readonly company?: UpdateCompanyDataDto;

  @IsOptional()
  @IsString()
  readonly producingCountry?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateShelfLifeDto)
  readonly shelfLife?: UpdateShelfLifeDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateIngredientDto)
  readonly ingredients?: UpdateIngredientDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateStorageInformationDto)
  readonly storageInformation?: UpdateStorageInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNutritionalDataDto)
  readonly nutritionalData?: UpdateNutritionalDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCategorySpecsBaseDto, {
    discriminator: {
      property: 'specArchetype',
      subTypes: [
        {
          name: SpecArchetype.GENERIC,
          value: UpdateGenericCategorySpecsDto,
        },
        {
          name: SpecArchetype.ALCOHOLIC_BEVERAGE,
          value: UpdateAlcoholicBeverageSpecsDto,
        },
        {
          name: SpecArchetype.PERISHABLE_PROTEIN,
          value: UpdatePerishableProteinSpecsDto,
        },
        {
          name: SpecArchetype.PACKAGED_COUNT,
          value: UpdatePackagedCountSpecsDto,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  readonly categorySpecs?: TUpdateCategorySpecsDto;
}
