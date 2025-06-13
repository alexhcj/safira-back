import {
  CategoryTypeEnum,
  PrimeCategoryEnum,
  SubCategoryEnum,
} from '../../products/enums/categories.enum';
import { BasicCategoryType } from '../../products/interfaces/category.interface';

export interface ILink {
  page?: string;
  categoryType?: CategoryTypeEnum;
  categoryValue?: PrimeCategoryEnum | SubCategoryEnum | BasicCategoryType;
}
