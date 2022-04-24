import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

enum PostCategory {
  sale = 'sale',
  special = 'special',
  free = 'free',
  holidays = 'holidays',
  recipes = 'recipes',
  ecommerce = 'ecommerce',
  other = 'other',
}

@Schema({ collection: 'posts', timestamps: true })
export class Post {
  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;

  @Prop({ required: true, default: PostCategory.other })
  readonly category: PostCategory;

  @Prop()
  readonly tags: [];
}

export const PostScheme = SchemaFactory.createForClass(Post);
