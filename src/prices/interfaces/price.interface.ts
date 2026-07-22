export interface IPriceRaw {
  _id: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  discountPrice?: number;
}

export interface IPrice {
  price: number;
  discountPrice?: number;
}

export interface IPriceRO {
  price: IPrice;
}
