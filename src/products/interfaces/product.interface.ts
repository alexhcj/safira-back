import { Product } from '../schemes/product.scheme';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from './category.interface';
import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  price: Types.ObjectId;
  description?: string;
  primeCategory: string;
  subCategory: string;
  basicCategory: string;
  popularity?: number;
  views?: number;
  rating?: number;
  specifications: {
    company: string;
    producingCountry?: string;
    quantity: number;
    shelfLife: Date;
  };
  reviews?: Types.ObjectId[];
  tags?: Types.ObjectId[];
}

interface IProductMeta {
  total: number;
  page: number;
  isLastPage: boolean;
  minPrice: number;
  maxPrice: number;
}

interface IProductBySlug {
  _id: string;
  slug: string;
  name: string;
}

export interface IProductRO {
  product: Product;
}

export interface IProductsRO {
  products: Product[];
  meta: IProductMeta;
}

export interface IProductsBySlugRO {
  products: IProductBySlug[];
}

export interface IProductQuery {
  name?: string;
  sort?: IProductSort;
  minPrice?: string;
  maxPrice?: string;
  order?: string;
  limit?: string;
  offset?: string;
  slug?: string;
  primeCategory?: PrimeCategoryEnum;
  subCategory?: SubCategoryEnum;
  basicCategory?: BasicCategoryType;
  brand?: string;
  dietary?: string;
}

export interface IProductFilter {
  name?: { $regex: string; $options?: string };
  minPrice?: { $gte: number };
  maxPrice?: { $lte: number };
  slug?: { $regex: string; $options?: string };
}

export type IProductSort = {
  [sort: string]: number | any;
};
