import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Profile } from '../../profiles/schemes/profile.scheme';

export type CommentItemDocument = CommentItem & Document;

@Schema({
  timestamps: true,
})
export class CommentItem {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Profile.name })
  readonly user: Profile;

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
