import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Price } from '../../prices/schemes/price.scheme';
import { Review } from '../../reviews/schemes/review.scheme';
import { Tag } from '../../tags/schemes/tag.scheme';

export type ProductDocument = Product & Document;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ required: true })
  readonly name: string;

  @Prop()
  readonly slug: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Price.name })
  readonly price: Price;

  @Prop({ required: true })
  readonly description: string;

  @Prop({ default: 0 })
  readonly quantity: number;

  @Prop()
  readonly category: string;

  @Prop()
  readonly subCategory: string;

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

  @Prop({ type: [SchemaTypes.ObjectId], ref: Tag.name })
  readonly tags: Tag[];

  @Prop()
  readonly productTags: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Review.name, default: [] })
  readonly reviews: Review;
}

export const ProductScheme = SchemaFactory.createForClass(Product);

ProductScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
