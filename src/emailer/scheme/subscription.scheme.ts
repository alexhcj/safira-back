import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ collection: 'subscriptions', timestamps: true })
export class Subscription {
  @Prop({ required: true, type: String })
  readonly email: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  readonly userId: Types.ObjectId;

  @Prop({ required: true, type: Boolean, default: true })
  readonly devNews: boolean;

  @Prop({ required: true, type: Boolean, default: true })
  readonly marketingNews: boolean;

  @Prop({ required: true, type: Boolean, default: true })
  readonly blogNews: boolean;
}

export const SubscriptionScheme = SchemaFactory.createForClass(Subscription);

SubscriptionScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
