import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';

export type VerificationDocument = Verification & Document;

@Schema({ collection: 'verifications', timestamps: false })
export class Verification {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  readonly userId: User;

  @Prop({ required: true, default: false })
  isPrivacyConfirmed: boolean;

  @Prop({ required: true, default: false })
  isEmailVerified: boolean;

  @Prop({ maxlength: 6, minlength: 6 })
  code: number;

  @Prop({ type: Date })
  codeCreatedAt: Date;
}

export const VerificationScheme = SchemaFactory.createForClass(Verification);

VerificationScheme.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['__v'];
    return ret;
  },
});
