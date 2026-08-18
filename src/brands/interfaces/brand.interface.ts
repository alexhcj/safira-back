import { BrandTypeEnum } from '../enums/brand-type.enum';
import { BrandStatusEnum } from '../enums/brand-status.enum';
import { BrandDocument } from '../schemes/brand.schema';

export interface IBrandRaw {
  readonly _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  normalizedName: string;
  slug: string;
  aliases?: string[];
  logo?: string;
  previewImage?: string;
  description?: string;
  website?: string;
  location?: string;
  type?: BrandTypeEnum;
  status?: BrandStatusEnum;
  source?: string;
}

export interface IBrand {
  displayName: string;
  normalizedName: string;
  slug: string;
  aliases?: string[];
  logo?: string;
  previewImage?: string;
  description?: string;
  website?: string;
  location?: string;
  type?: BrandTypeEnum;
  status?: BrandStatusEnum;
  source?: string;
}

export interface IBrandsQuery {
  includeArchived?: boolean;
}

export interface IBrandsRO {
  name: string;
  brands: { slug: string; displayName: string }[];
}

export interface IFindBrandBySlugRO {
  brand: BrandDocument;
}
