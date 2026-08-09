import { OfferEnum } from '../enums/offer.enum';
import { Product } from '../../products/schemes/product.scheme';
import { ILink } from './link.interface';

export interface IOfferQuery {
  type?: OfferEnum;
}

export interface IOfferFilter {
  type?: { $regex: string; $options?: string };
}

export interface IOffer {
  type: OfferEnum;
  expiresDate: string;
  link?: ILink;
  title?: string;
  upTitle?: string;
  text?: string;
  img?: string;
  deal?: Product;
}
