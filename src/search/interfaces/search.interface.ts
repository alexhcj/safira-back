export interface ISearchProduct {
  type: string;
  slug: string;
  name: string;
  price: {
    price: number;
    discountPrice: number;
  };
  subCategory: string;
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
