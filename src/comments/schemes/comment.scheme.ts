import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';

export type CommentDocument = Comment & Document;

@Schema({
  collection: 'comments',
  timestamps: true,
})
export class Comment {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  readonly userId: User;

  @Prop({ required: true, type: String })
  readonly text: string;

  @Prop({ required: true, type: String })
  readonly postSlug: string;
}

export const CommentScheme = SchemaFactory.createForClass(Comment);

CommentScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['userId'];
    delete ret['_id'];
    delete ret['__v'];
    return { ...ret, user: doc.userId };
  },
});
