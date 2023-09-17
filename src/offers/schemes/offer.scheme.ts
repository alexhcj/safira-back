import { Document, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OfferEnum } from '../enums/offer.enum';
import { Product } from '../../products/schemes/product.scheme';

export type OfferDocument = Offer & Document;

@Schema({
  collection: 'offers',
  timestamps: true,
})
export class Offer {
  @Prop({ required: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum;

  @Prop({ required: true, type: Date })
  readonly expiresDate: string;

  @Prop()
  readonly title?: string;

  @Prop()
  readonly upTitle?: string;

  @Prop()
  readonly text?: string;

  @Prop()
  readonly img?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Product.name })
  readonly deal?: Product;
}

export const OfferScheme = SchemaFactory.createForClass(Offer);

OfferScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
