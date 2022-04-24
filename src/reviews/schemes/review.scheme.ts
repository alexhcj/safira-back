import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type ReviewDocument = Review & Document;

enum ReviewType {
  Product = 'Product',
  Post = 'Post',
}

@Schema({ collection: 'reviews', timestamps: true })
export class Review {
  @Prop({
    required: true,
    type: String,
    enum: ReviewType,
  })
  readonly reviewType: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    refPath: 'reviewType',
    required: true,
  })
  readonly objectId: Types.ObjectId;

  @Prop()
  readonly author: string;

  @Prop()
  readonly text: string;

  @Prop()
  readonly rating: number;
}

export const ReviewScheme = SchemaFactory.createForClass(Review);
