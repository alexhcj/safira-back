import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { IReview } from '../review.interface';
import { Profile } from '../../profiles/schemes/profile.scheme';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
})
export class ReviewItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: Profile.name })
  readonly user: Profile;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly rating: number;
}

export const ReviewItemScheme = SchemaFactory.createForClass(ReviewItem);

@Schema({ collection: 'reviews' })
export class Review {
  @Prop({ required: true })
  readonly reviewProductSlug: string;

  @Prop({ type: [ReviewItemScheme], default: [] })
  readonly reviews: IReview[];
}

export const ReviewScheme = SchemaFactory.createForClass(Review);

ReviewScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
