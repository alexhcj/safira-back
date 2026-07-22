import { IPrice } from '../../prices/interfaces/price.interface';

export interface ISearchProduct {
  type: string;
  slug: string;
  name: string;
  price: IPrice;
  subCategory: {
    name: string;
    slug: string;
  };
}

export interface ISearchPost {
  type: string;
  slug: string;
  title: string;
  createdAt: Date;
}

export interface ISearchRO {
  search: Array<ISearchProduct | ISearchPost>;
  relatedCount: number;
}
