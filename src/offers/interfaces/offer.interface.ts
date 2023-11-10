import { OfferEnum } from '../enums/offer.enum';

export interface IOfferQuery {
  type?: OfferEnum;
}

export interface IOfferFilter {
  type?: { $regex: string; $options?: string };
}
