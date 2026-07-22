import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryTypeEnum } from '../enums/category-type.enum';

export type CategoryDocument = Category & Document;

@Schema({
  collection: 'categories',
  timestamps: true,
})
export class Category {
  @Prop({ required: true })
  readonly name: string; // "Beans & Peas"

  @Prop({ required: true })
  readonly slug: string; // "beans-peas"

  @Prop({ enum: CategoryTypeEnum, required: true })
  readonly type: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  readonly parentId: Types.ObjectId | null;

  @Prop({ default: 0 })
  readonly order: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ slug: 1, type: 1 }, { unique: true }).set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
