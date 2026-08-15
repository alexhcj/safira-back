import { CreateGenericCategorySpecsDto } from './create-generic-category-specs.dto';
import { CreateAlcoholicBeverageSpecsDto } from './create-alcoholic-beverage-specs.dto';
import { CreateNonAlcoholicBeverageSpecsDto } from './create-non-alcoholic-beverage-specs.dto';
import { CreatePerishableProteinSpecsDto } from './create-perishable-protein-specs.dto';
import { CreatePackagedCountSpecsDto } from './create-packaged-count-specs.dto';
import { UpdateGenericCategorySpecsDto } from './update-generic-category-specs.dto';
import { UpdateAlcoholicBeverageSpecsDto } from './update-alcoholic-beverage-specs.dto';
import { UpdateNonAlcoholicBeverageSpecsDto } from './update-non-alcoholic-beverage-specs.dto';
import { UpdatePerishableProteinSpecsDto } from './update-perishable-protein-specs.dto';
import { UpdatePackagedCountSpecsDto } from './update-packaged-count-specs.dto';
import { CreateCookingOilSpecsDto } from './create-cooking-oil-specs.dto';
import { UpdateCookingOilSpecsDto } from './update-cooking-oil-specs.dto';
import { CreatePreservedFoodSpecsDto } from './create-preserved-food-specs.dto';
import { UpdatePreservedFoodSpecsDto } from './update-preserved-food-specs.dto';

export type TCreateCategorySpecsDto =
  | CreateGenericCategorySpecsDto
  | CreateAlcoholicBeverageSpecsDto
  | CreateNonAlcoholicBeverageSpecsDto
  | CreatePerishableProteinSpecsDto
  | CreatePackagedCountSpecsDto
  | CreateCookingOilSpecsDto
  | CreatePreservedFoodSpecsDto;

export type TUpdateCategorySpecsDto =
  | UpdateGenericCategorySpecsDto
  | UpdateAlcoholicBeverageSpecsDto
  | UpdateNonAlcoholicBeverageSpecsDto
  | UpdatePerishableProteinSpecsDto
  | UpdatePackagedCountSpecsDto
  | UpdateCookingOilSpecsDto
  | UpdatePreservedFoodSpecsDto;
