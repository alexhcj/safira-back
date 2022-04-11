import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true })
  readonly description: string;

  @Prop({ required: true })
  readonly price: number;

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

  // TODO: change to objectId
  @Prop()
  readonly reviews: string;
}

export const ProductScheme = SchemaFactory.createForClass(Product);
