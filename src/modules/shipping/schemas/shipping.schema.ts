import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const SHIPPING_MODEL = 'shipping';

@Schema({ timestamps: true, collection: SHIPPING_MODEL })
export class Shipping {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  quantity: MongooseSchema.Types.Decimal128;

  @Prop({ required: true })
  code: string;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  percent_discount: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: String })
  gift?: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, type: MongooseSchema.Types.Date })
  start_date: MongooseSchema.Types.Date;

  @Prop({ required: true, type: MongooseSchema.Types.Date })
  expiration_date: MongooseSchema.Types.Date;
}

export type ShippingDocument = Shipping & Document;
export const ShippingSchema = SchemaFactory.createForClass(Shipping);
