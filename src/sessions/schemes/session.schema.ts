import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';

export type SessionDocument = Session & Document;

@Schema({ collection: 'sessions', timestamps: true })
export class Session {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  readonly userId: User;

  @Prop({ required: true })
  refreshTokenHash: string;

  @Prop({ required: true })
  familyId: string;

  @Prop({ required: true, default: false })
  revoked: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String })
  clientId: string;

  @Prop({ type: String })
  ipAddress: string;

  @Prop({ type: Date })
  lastUsedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// TTL index — Mongo auto-deletes the doc once expiresAt passes
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

SessionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['refreshTokenHash'];
    delete ret['__v'];
    return ret;
  },
});
