import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';
import { IReview } from '../review.interface';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
})
export class ReviewItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  readonly user: User;

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
  readonly comments: IReview[];
}

export const ReviewScheme = SchemaFactory.createForClass(Review);

ReviewScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
