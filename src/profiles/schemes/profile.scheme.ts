import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';
import { File } from '../../files/schemes/file.scheme';

export type ProfileDocument = Profile & Document;

@Schema({ collection: 'profiles', timestamps: true })
export class Profile {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  readonly userId: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: File.name })
  avatarId: File;

  @Prop({ type: String })
  readonly firstName: string;

  @Prop({ type: String })
  readonly lastName: string;

  @Prop({ type: Date })
  readonly dateOfBirth: Date;

  @Prop({ type: String })
  readonly location: string;

  @Prop({ type: String })
  readonly phone: string;
}

export const ProfileScheme = SchemaFactory.createForClass(Profile);

ProfileScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
