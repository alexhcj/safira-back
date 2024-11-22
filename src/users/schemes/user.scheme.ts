import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  readonly passwordHash: string;
}

export const UserScheme = SchemaFactory.createForClass(User);

UserScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['passwordHash'];
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
