import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Price, PriceDocument } from '../../prices/schemes/price.scheme';
import { Review } from '../../reviews/schemes/review.scheme';
import { Tag } from '../../tags/schemes/tag.scheme';
import { PrimeCategoryEnum, SubCategoryEnum } from '../enums/categories.enum';
import { BasicCategoryType } from '../interfaces/category.interface';
import { ShelfLifeUnitEnum } from '../enums/shelf-life-unit.enum';

@Schema({ _id: false })
class Company {
  @Prop({ required: true })
  readonly displayName: string;

  @Prop({ required: true })
  readonly normalizedName: string;

  @Prop({ required: true })
  readonly slug: string;
}

@Schema({ _id: false })
class ShelfLife {
  @Prop({ required: true, min: 1 })
  readonly value: number;

  @Prop({ required: true, type: String, enum: ShelfLifeUnitEnum })
  readonly unit: ShelfLifeUnitEnum;
}

@Schema({ _id: false })
class Specifications {
  @Prop({ required: true })
  readonly company: Company;

  @Prop()
  readonly producingCountry: string;

  @Prop({ required: true })
  readonly shelfLife: ShelfLife;

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
  price: PriceDocument;

  @Prop()
  readonly description: string;

  @Prop({ required: true, type: String, enum: PrimeCategoryEnum })
  readonly primeCategory: string;

  @Prop({ type: String, enum: SubCategoryEnum, default: undefined })
  readonly subCategory: string;

  @Prop({ default: undefined })
  readonly basicCategory: BasicCategoryType;

  @Prop({ default: 0 })
  readonly popularity: number;

  @Prop({ default: 0 })
  readonly views: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Tag.name, default: undefined })
  readonly tags: Tag;

  @Prop({ type: SchemaTypes.ObjectId, ref: Review.name, default: undefined })
  readonly reviews: Review;

  @Prop({ type: Specifications })
  readonly specifications: Specifications;
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
