import { Product, ProductDocument } from '../schemes/product.scheme';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from './category.interface';
import { Types } from 'mongoose';

interface ISpecifications {
  company: string;
  producingCountry?: string;
  quantity: number;
  shelfLife: Date;
}

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
  tags?: Types.ObjectId[];
  reviews?: Types.ObjectId[];
  specifications: ISpecifications;
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
  product: ProductDocument;
}

export interface IProductsRO {
  products: Product[];
  meta: IProductMeta;
}

export interface IProductsBySlugRO {
  products: IProductBySlug[];
}

export interface IBrandsRO {
  name: string;
  brands: string[];
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

export interface IProductRelatedQuery {
  slug: string;
  limit?: string;
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
