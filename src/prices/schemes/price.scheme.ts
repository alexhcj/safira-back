import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PriceDocument = Price & Document;

@Schema({ collection: 'prices', timestamps: true })
export class Price {
  @Prop({ required: true })
  readonly price: number;

  @Prop()
  readonly discount_price: number;
}

export const PriceScheme = SchemaFactory.createForClass(Price);

PriceScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
