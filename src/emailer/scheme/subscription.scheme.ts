import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ collection: 'subscriptions', timestamps: true })
export class Subscription {
  @Prop({ required: true, type: String })
  readonly email: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  readonly userId: Types.ObjectId;

  @Prop({ required: true, type: Boolean, default: false })
  readonly devNews: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  readonly marketingNews: boolean;

  @Prop({ required: true, type: Boolean, default: false })
  readonly blogNews: boolean;

  @Prop({ type: String, default: undefined })
  readonly unsubReason: string;

  @Prop({ type: String, default: undefined })
  readonly unsubFeedback: string;
}

export const SubscriptionScheme = SchemaFactory.createForClass(Subscription);

SubscriptionScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['email'];
    delete ret['userId'];
    delete ret['_id'];
    delete ret['id'];
    delete ret['__v'];
    return ret;
  },
});
