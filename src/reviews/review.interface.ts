import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  text?: string;
  rating?: number;
}
