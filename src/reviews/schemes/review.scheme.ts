import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Product } from '../../products/schemes/product.scheme';

export type ReviewDocument = Review & Document;

@Schema({ collection: 'reviews', timestamps: true })
export class Review {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Product',
    required: true,
  })
  readonly productId: Product;

  @Prop()
  readonly author: string;

  @Prop()
  readonly text: string;

  @Prop()
  readonly rating: number;
}

export const ReviewScheme = SchemaFactory.createForClass(Review);
