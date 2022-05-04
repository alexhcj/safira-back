import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Price } from '../../prices/schemes/price.scheme';
import { Review } from '../../reviews/schemes/review.scheme';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  readonly name: string;

  @Prop()
  readonly slug: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Price' })
  readonly price: Price;

  @Prop({ required: true })
  readonly description: string;

  @Prop({ default: '' })
  readonly img: string;

  @Prop({ default: 0 })
  readonly quantity: number;

  @Prop()
  readonly category: string;

  @Prop({ default: 0 })
  readonly popularity: string;

  @Prop({ default: 0 })
  readonly views: number;

  @Prop({ default: 0 })
  readonly rating: number;

  @Prop()
  readonly company: string;

  @Prop()
  readonly importCountry: string;

  @Prop()
  readonly shelfLife: Date;

  @Prop()
  readonly tags: string[];

  @Prop()
  readonly productTags: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Review' })
  readonly reviews: Review;
}

export const ProductScheme = SchemaFactory.createForClass(Product);
