import { ProductDocument } from '../schemes/product.scheme';
import { Types } from 'mongoose';
import { IPrice, IPriceRaw } from '../../prices/interfaces/price.interface';
import { ITags } from '../../tags/interfaces/tags.interface';
import { IReviews } from '../../reviews/interfaces/review.interface';
import { IInventory } from './inventory.interface';
import {
  ISpecifications,
  ISpecificationsRaw,
} from './specifications/specifications.interface';
import { IPackaging } from './packaging/packaging.interface';
import { IShippingDetails } from './shipping-details/shipping-details.interface';
import { IBrandRaw } from '../../brands/interfaces/brand.interface';

export interface ICreateProduct {
  name: string;
  slug: string;
  price: Types.ObjectId;
  excerpt: string;
  description?: string;
  primeCategory: string;
  subCategory?: string;
  basicCategory?: string;
  popularity?: number;
  views?: number;
  rating?: number;
  tags?: Types.ObjectId;
  reviews?: Types.ObjectId;
  specifications: ISpecifications;
  inventory: IInventory;
  packaging: IPackaging;
  shippingDetails?: IShippingDetails;
}

export interface IProductRaw {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  price: IPriceRaw;
  description?: string;
  primeCategory: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string;
    slug: string;
  };
  basicCategory: {
    name: string;
    slug: string;
  };
  popularity?: number;
  views?: number;
  rating?: number;
  tags?: ITags;
  reviews?: IReviews;
  specifications: ISpecificationsRaw;
}

export interface IProduct {
  name: string;
  slug: string;
  price: IPrice;
  description?: string;
  primeCategory: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string;
    slug: string;
  };
  basicCategory: {
    name: string;
    slug: string;
  };
  popularity?: number;
  views?: number;
  rating?: number;
  tags?: ITags;
  reviews?: IReviews;
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

export interface IProductsRawRO {
  products: IProductRaw[];
  meta: IProductMeta;
}

export interface IProductsRO {
  products: IProduct[];
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
  primeCategory?: string;
  subCategory?: string;
  basicCategory?: string;
  brand?: string;
  dietary?: string;
}

export interface IProductRelatedQuery {
  slug: string;
  limit?: string;
}

interface IQueryBrandData {
  brand: IBrandRaw;
  popularity: number;
  quantity: number;
}

export interface IFindQueryBrandsRO {
  brands: IQueryBrandData[];
  dietary?: string[];
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
