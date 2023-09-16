import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Price } from '../../prices/schemes/price.scheme';
import { Review } from '../../reviews/schemes/review.scheme';
import { Tag } from '../../tags/schemes/tag.scheme';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from '../interfaces/category.interface';

@Schema({ _id: false })
class Specifications {
  @Prop({ required: true })
  readonly company: string;

  @Prop()
  readonly importCountry: string;

  @Prop({ required: true })
  readonly shelfLife: Date;

  @Prop({ default: 0 })
  readonly quantity: number;
}

export type ProductDocument = Product & Document;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true })
  readonly slug: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Price.name })
  price: Price;

  @Prop()
  readonly description: string;

  @Prop({ required: true, type: String, enum: PrimeCategoryEnum })
  readonly primeCategory: string;

  @Prop({ type: String, enum: SubCategoryEnum })
  readonly subCategory: string;

  @Prop()
  readonly basicCategory: BasicCategoryType;

  @Prop({ default: 0 })
  readonly popularity: number;

  @Prop({ default: 0 })
  readonly views: number;

  @Prop({ default: 0 })
  readonly rating: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Tag.name, default: undefined })
  readonly tags: Tag;

  @Prop({ type: SchemaTypes.ObjectId, ref: Review.name, default: undefined })
  readonly reviews: Review;

  @Prop({ type: Specifications })
  specifications: Specifications;
}

export const ProductScheme = SchemaFactory.createForClass(Product);

ProductScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
