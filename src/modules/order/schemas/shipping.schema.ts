import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const SHIPPING_MODEL = 'shipping';

@Schema({ timestamps: true, collection: SHIPPING_MODEL })
export class Shipping {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String })
  phone_number: string;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  price: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, type: String })
  policy: string;
}

export type ShippingDocument = Shipping & Document;
export const ShippingSchema = SchemaFactory.createForClass(Shipping);
