import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';
import { IReview } from '../review.interface';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class ReviewItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  readonly userId: User;

  @Prop()
  readonly text: string;

  @Prop()
  readonly rating: number;
}

export const ReviewItemScheme = SchemaFactory.createForClass(ReviewItem);

@Schema({ collection: 'reviews' })
export class Review {
  @Prop({ required: true })
  readonly reviewObjectSlug: string;

  @Prop({ type: [ReviewItemScheme], default: [] })
  readonly reviews: IReview[];
}

export const ReviewScheme = SchemaFactory.createForClass(Review);
