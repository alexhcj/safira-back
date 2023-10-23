import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ collection: 'files', timestamps: true })
export class File {
  @Prop({ required: true, type: String })
  readonly filename: string;

  @Prop({ required: true, type: String })
  readonly path: string;

  @Prop({ required: true, type: String })
  readonly mimetype: string;
}

export const FileScheme = SchemaFactory.createForClass(File);

FileScheme.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
