import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';

export type CommentDocument = Comment & Document;

@Schema({
  collection: 'comments',
  timestamps: true,
})
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  readonly userId: User;

  @Prop()
  readonly text: string;
}

export const CommentScheme = SchemaFactory.createForClass(Comment);

CommentScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    return ret;
  },
});
