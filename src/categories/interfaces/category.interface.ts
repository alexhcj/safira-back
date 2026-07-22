import { Types } from 'mongoose';
import { CategoryTypeEnum } from '../enums/category-type.enum';

export interface ICategory {
  name: string;
  slug: string;
  type: CategoryTypeEnum;
  parentId: Types.ObjectId | null;
  order: number;
}

export interface ICategoryQuery {
  name?: string;
  slug?: string;
  type: CategoryTypeEnum;
  sort?: string;
  order?: string;
  limit?: string;
}

export interface ICategoryFilter {
  name?: { $regex: string; $options?: string };
  slug?: { $regex: string; $options?: string };
  type?: CategoryTypeEnum;
}
