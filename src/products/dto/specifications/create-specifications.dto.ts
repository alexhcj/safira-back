import {
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateShelfLifeDto } from './create-shelf-life.dto';
import { CreateIngredientDto } from './create-ingredient.dto';
import { CreateStorageInformationDto } from './create-storage-information.dto';
import { CreateNutritionalDataDto } from './create-nutritional-data.dto';
import { SpecArchetype } from '../../enums/category-specs.enum';
import { CreateAlcoholicBeverageSpecsDto } from './category-specs/create-alcoholic-beverage-specs.dto';
import { CreateGenericCategorySpecsDto } from './category-specs/create-generic-category-specs.dto';
import { CreatePerishableProteinSpecsDto } from './category-specs/create-perishable-protein-specs.dto';
import { CreatePackagedCountSpecsDto } from './category-specs/create-packaged-count-specs.dto';
import { CreateCategorySpecsBaseDto } from './category-specs/create-category-specs-base.dto';
import { TCreateCategorySpecsDto } from './category-specs/category-specs.dto-type';
import { CreateCookingOilSpecsDto } from './category-specs/create-cooking-oil-specs.dto';
import { CreatePreservedFoodSpecsDto } from './category-specs/create-preserved-food-specs.dto';
import { CreateNonAlcoholicBeverageSpecsDto } from './category-specs/create-non-alcoholic-beverage-specs.dto';

export class CreateSpecificationsDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly brand: string;

  @IsOptional()
  @IsString()
  readonly producingCountry?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateShelfLifeDto)
  readonly shelfLife: CreateShelfLifeDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  readonly ingredients?: CreateIngredientDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStorageInformationDto)
  readonly storageInformation?: CreateStorageInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateNutritionalDataDto)
  readonly nutritionalData?: CreateNutritionalDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCategorySpecsBaseDto, {
    discriminator: {
      property: 'specArchetype',
      subTypes: [
        {
          name: SpecArchetype.GENERIC,
          value: CreateGenericCategorySpecsDto,
        },
        {
          name: SpecArchetype.ALCOHOLIC_BEVERAGE,
          value: CreateAlcoholicBeverageSpecsDto,
        },
        {
          name: SpecArchetype.NON_ALCOHOLIC_BEVERAGE,
          value: CreateNonAlcoholicBeverageSpecsDto,
        },
        {
          name: SpecArchetype.PERISHABLE_PROTEIN,
          value: CreatePerishableProteinSpecsDto,
        },
        {
          name: SpecArchetype.PACKAGED_COUNT,
          value: CreatePackagedCountSpecsDto,
        },
        {
          name: SpecArchetype.COOKING_OIL,
          value: CreateCookingOilSpecsDto,
        },
        {
          name: SpecArchetype.PRESERVED_FOOD,
          value: CreatePreservedFoodSpecsDto,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  readonly categorySpecs?: TCreateCategorySpecsDto;
}
