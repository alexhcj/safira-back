import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemes/user.scheme';

export type CommentUserDocument = CommentUser & Document;

class CommentUser {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  readonly _id: User;

  @Prop({ required: true, type: String })
  readonly fullName: string;
}

export type CommentItemDocument = CommentItem & Document;

@Schema({
  timestamps: true,
})
export class CommentItem {
  @Prop({ objectType: CommentUser })
  readonly user: CommentUser;

  @Prop({ type: String })
  readonly text: string;

  @Prop({ default: undefined })
  comments: [this];
}

export const CommentItemScheme = SchemaFactory.createForClass(CommentItem);

CommentItemScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});

export type CommentDocument = Comment & Document;

@Schema({
  collection: 'comments',
  timestamps: true,
})
export class Comment {
  @Prop({ required: true, type: String })
  readonly postSlug: string;

  @Prop({ type: [CommentItemScheme], default: undefined })
  comments: Comment[];
}

export const CommentScheme = SchemaFactory.createForClass(Comment);

CommentScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
