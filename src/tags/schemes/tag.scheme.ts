import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TagTypeEnum } from '../enum/tag-type.enum';
import { DietaryTagsEnum } from '../enum/dietary-tags.enum';
import { PostTagsEnum } from '../enum/post-tags.enum';
import { PromotionTagsEnum } from '../enum/promotion-tags.enum';
import { ProductTagsEnum } from '../enum/product-tags.enum';

export type TagsDocument = Tags & Document;

@Schema({ _id: false })
export class Tags {
  @Prop({ type: () => [String], enum: DietaryTagsEnum, default: undefined })
  dietaries: DietaryTagsEnum[];

  @Prop({ type: () => [String], enum: PostTagsEnum, default: undefined })
  common: PostTagsEnum[] | ProductTagsEnum[];

  @Prop({ type: () => [String], enum: PromotionTagsEnum, default: undefined })
  promotions: PromotionTagsEnum[];
}
export const TagsScheme = SchemaFactory.createForClass(Tags);

TagsScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['__v'];
    delete ret['_id'];
    delete ret['id'];
    return ret;
  },
});

export type TagDocument = Tag & Document;

@Schema({ collection: 'tags', timestamps: true })
export class Tag {
  @Prop({ required: true })
  readonly type: TagTypeEnum;

  @Prop({ type: TagsScheme })
  readonly tags: Tags;
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
