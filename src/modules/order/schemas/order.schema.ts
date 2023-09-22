import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PRODUCT_INFOS_MODEL } from 'src/modules/product-info/schemas/product-info.schema';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { OrderStatus, OrderType } from 'src/shares/enums/order.enum';
import { PAYMENT_METHOD_MODEL } from './payment-method.schema';
import { SHIPPING_MODEL } from './shipping.schema';
export const ORDER_MODEL = 'orders';

export class Timestamps {
  @Prop({ required: false, type: Number })
  start_time?: number;

  @Prop({ required: false, type: Number })
  end_time?: number;
}
export class Date {
  @Prop({ required: false, type: Number })
  start_date?: number;

  @Prop({ required: false, type: Number })
  end_date?: number;
}

export class PhoneTime {
  @Prop({ required: false, type: MongooseSchema.Types.Date })
  end_time: MongooseSchema.Types.Date;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  start_time: MongooseSchema.Types.Date;
}

@Schema({ timestamps: true, collection: ORDER_MODEL })
export class Order {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  client_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: PRODUCT_INFOS_MODEL, index: true }] })
  products: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String, enum: OrderType, default: OrderType.EXTEND })
  type: OrderType;

  @Prop({ required: false, type: String })
  link_pancake?: string;

  @Prop({ required: false, type: String })
  name_pancake?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: PAYMENT_METHOD_MODEL })
  payment_method_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: Timestamps })
  delivery_time?: Timestamps;

  @Prop({ required: false, type: Date })
  delivery_date?: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: SHIPPING_MODEL })
  shipping_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: String })
  describe?: string;

  @Prop({ required: true, type: Number, default: 0 })
  quantity: number;

  @Prop({ required: false, type: String })
  zip_code?: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  shipping_at?: MongooseSchema.Types.Date;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  receive_at?: MongooseSchema.Types.Date;

  @Prop({ required: false, type: String })
  user_note?: string;

  @Prop({ required: false, type: String })
  shipping_note?: string;

  @Prop({ required: false, type: String })
  language?: string;

  @Prop({ required: false, type: String })
  origin?: string;

  @Prop({ required: false, type: PhoneTime })
  phone_time?: PhoneTime;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  deposit?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, enum: OrderStatus })
  status?: OrderStatus;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
