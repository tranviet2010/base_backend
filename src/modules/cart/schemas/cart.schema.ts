import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PRODUCT_INFOS_MODEL } from 'src/modules/product-info/schemas/product-info.schema';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
export const CART_MODEL = 'carts';
@Schema({ timestamps: true, collection: CART_MODEL })
export class Cart {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: `${USER_MODEL}` })
  user_id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: PRODUCT_INFOS_MODEL })
  product_id: string;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
