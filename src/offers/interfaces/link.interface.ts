import {
  CategoryTypeEnum,
  PrimeCategoryEnum,
  SubCategoryEnum,
} from '../enums/categories.enum';
import { BasicCategoryType } from './category.interface';

export interface ILink {
  page?: string;
  categoryType?: CategoryTypeEnum;
  categoryValue?: PrimeCategoryEnum | SubCategoryEnum | BasicCategoryType;
}
