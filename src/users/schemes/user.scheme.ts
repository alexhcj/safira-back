import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  readonly email: string;

  @Prop({ required: true })
  readonly passwordHash: string;
}

export const UserScheme = SchemaFactory.createForClass(User);
