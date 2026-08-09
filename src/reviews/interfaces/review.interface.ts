import { Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

export interface ICreateReview {
  user: Types.ObjectId;
  text: string;
  rating: number;
}

export interface IReview {
  user: Types.ObjectId;
  text: string;
  rating: number;
}

export interface IReviews {
  reviewProductSlug: string;
  reviews: IReview[];
}

export interface IReviewCreateRO {
  status: HttpStatus;
}
