import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OfferEnum } from '../enums/offer.enum';

export type HeroSliderDocument = HeroSlider & Document;
export type PromoDocument = Promo & Document;
export type SpecialDocument = Special & Document;
export type ShopDocument = Shop & Document;

@Schema({
  collection: 'offers',
  timestamps: true,
})
export class HeroSlider {
  @Prop({ required: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum.HERO_SLIDER;

  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly upTitle: string;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;
}

export class Promo {
  @Prop({ required: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum.PROMO;

  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly upTitle: string;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;
}

export class Special {
  @Prop({ required: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum.SPECIAL;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;
}

export class Shop {
  @Prop({ required: true, enum: OfferEnum, type: String })
  readonly type: OfferEnum.SHOP;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;
}

export const HeroSliderScheme = SchemaFactory.createForClass(HeroSlider);
export const PromoScheme = SchemaFactory.createForClass(Promo);
export const SpecialScheme = SchemaFactory.createForClass(Special);
export const ShopScheme = SchemaFactory.createForClass(Shop);

HeroSliderScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});

PromoScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});

SpecialScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});

ShopScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
