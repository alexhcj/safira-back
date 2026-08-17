import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BrandTypeEnum } from '../enums/brand-type.enum';
import { BrandStatusEnum } from '../enums/brand-status.enum';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ collection: 'brands', timestamps: true })
export class Brand {
  @Prop({ required: true })
  readonly displayName: string;

  @Prop({ required: true })
  normalizedName: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ type: [String], default: [] })
  readonly aliases?: string[];

  @Prop()
  readonly logo?: string;

  @Prop()
  readonly previewImage?: string;

  @Prop()
  readonly description?: string;

  @Prop()
  readonly website?: string;

  @Prop()
  readonly location?: string;

  @Prop({ enum: BrandTypeEnum, default: 'corporate' })
  readonly type?: BrandTypeEnum;

  @Prop({ enum: BrandStatusEnum, default: 'active' })
  readonly status?: BrandStatusEnum;

  @Prop()
  readonly source?: string; // 'auto-created' | 'migration' | 'self-registered' | 'admin-created'
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Indexes declared explicitly, not left implicit — create BEFORE bulk insert
BrandSchema.index({ normalizedName: 1 }, { unique: true });
BrandSchema.index({ slug: 1 }, { unique: true });
BrandSchema.index({ aliases: 1 }); // lookup must check aliases too
BrandSchema.index({ status: 1 }); // filtering active/pending in admin + public queries
BrandSchema.index({ type: 1 }); // filtering corporate vs local-producer later
BrandSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
