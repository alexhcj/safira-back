import { Product } from './schemes/product.scheme';

export interface IProductRO {
  product: Product;
}

export interface IProductsRO {
  products: Product[];
  productsCount: number;
}

export interface IProductFilter {
  slug?: string;
  name?: string;
  description?: string;
  quantity?: number;
  category?: string;
  popularity?: number;
  views?: number;
  rating?: number;
  company?: string;
  isImport?: boolean;
  shelfLife?: number;
  productTags?: string | [];
  tags?: string | [];
}
