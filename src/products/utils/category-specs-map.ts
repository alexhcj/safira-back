//           specArchetype
//                 │
//     ┌───────────┼───────────┐
//     ▼           ▼           ▼
// alcoholic    protein      packaged
//     │           │           │
//     ▼           ▼           ▼
//    DTO           DTO          DTO
//     │           │           │
//     ▼           ▼           ▼
//  Interface    Interface    Interface
//     │           │           │
//     ▼           ▼           ▼
// Mongoose discriminator

import { SpecArchetype } from '../enums/category-specs.enum';
import { CreateCategorySpecsBaseDto } from '../dto/specifications/category-specs/create-category-specs-base.dto';
import { CreateAlcoholicBeverageSpecsDto } from '../dto/specifications/category-specs/create-alcoholic-beverage-specs.dto';
import { CreateNonAlcoholicBeverageSpecsDto } from '../dto/specifications/category-specs/create-non-alcoholic-beverage-specs.dto';
import { CreatePerishableProteinSpecsDto } from '../dto/specifications/category-specs/create-perishable-protein-specs.dto';
import { CreatePackagedCountSpecsDto } from '../dto/specifications/category-specs/create-packaged-count-specs.dto';
import { CreateCookingOilSpecsDto } from '../dto/specifications/category-specs/create-cooking-oil-specs.dto';
import { CreatePreservedFoodSpecsDto } from '../dto/specifications/category-specs/create-preserved-food-specs.dto';

export const CATEGORY_SPECS_DTO_MAP = {
  [SpecArchetype.GENERIC]: CreateCategorySpecsBaseDto,
  [SpecArchetype.ALCOHOLIC_BEVERAGE]: CreateAlcoholicBeverageSpecsDto,
  [SpecArchetype.NON_ALCOHOLIC_BEVERAGE]: CreateNonAlcoholicBeverageSpecsDto,
  [SpecArchetype.PERISHABLE_PROTEIN]: CreatePerishableProteinSpecsDto,
  [SpecArchetype.PACKAGED_COUNT]: CreatePackagedCountSpecsDto,
  [SpecArchetype.COOKING_OIL]: CreateCookingOilSpecsDto,
  [SpecArchetype.PRESERVED_FOOD]: CreatePreservedFoodSpecsDto,
};
