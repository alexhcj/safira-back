export interface IOfferQuery {
  type?: string;
}

export interface IOfferFilter {
  type?: { $regex: string; $options?: string };
}
