import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ collection: 'posts', timestamps: true })
export class Post {
  @Prop({ required: true })
  readonly title: string;

  @Prop({ required: true })
  readonly text: string;

  @Prop({ required: true })
  readonly img: string;

  @Prop({ required: true })
  readonly category: string;
}

export const PostScheme = SchemaFactory.createForClass(Post);
