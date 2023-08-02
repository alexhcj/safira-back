import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PostCategoryEnum } from '../enums/post-category.enum';
import { Comment } from '../../comments/schemes/comment.scheme';

export type PostDocument = Post & Document;

@Schema({ collection: 'posts', timestamps: true })
export class Post {
  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly slug: string;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;

  @Prop({ required: true })
  readonly category: PostCategoryEnum;

  @Prop()
  readonly tags: [];

  @Prop({ type: [SchemaTypes.ObjectId], ref: Comment.name, default: [] })
  readonly comments: Comment[];
}

export const PostScheme = SchemaFactory.createForClass(Post);
