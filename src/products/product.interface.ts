import { Product } from './schemes/product.scheme';

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
}

export interface IProductFilter {
  name?: { $regex: string; $options?: string };
  minPrice?: { $gte: number };
  maxPrice?: { $lte: number };
  slug?: { $regex: string; $options?: string };
}

export type IProductSort = {
  [sort: string]: number | any; // TODO: replace any with price type (price & discount_price)
};
