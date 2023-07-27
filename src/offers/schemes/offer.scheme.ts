import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OfferEnum } from '../enums/offer.enum';

export type OfferDocument = Offer & Document;

@Schema({
  collection: 'offers',
  timestamps: true,
})
export class Offer {
  @Prop({ required: true, unique: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum;

  @Prop({ required: true })
  readonly img: string;

  @Prop({ required: true })
  readonly description: string;
}

export const OfferScheme = SchemaFactory.createForClass(Offer);

OfferScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
