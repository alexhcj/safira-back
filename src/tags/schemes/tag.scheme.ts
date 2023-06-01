import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductTagsEnum } from '../enum/product-tags.enum';
import { TagTypeEnum } from '../enum/tag-type.enum';

export type TagDocument = Tag & Document;

@Schema({ collection: 'tags', timestamps: true })
export class Tag {
  @Prop({ required: true })
  readonly tag: ProductTagsEnum;

  @Prop({ required: true })
  readonly type: TagTypeEnum;
}

export const TagScheme = SchemaFactory.createForClass(Tag);

TagScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['__v'];
    delete ret['_id'];
    return ret;
  },
});
