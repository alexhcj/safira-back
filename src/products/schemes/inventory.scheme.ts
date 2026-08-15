import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Inventory {
  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;
}
