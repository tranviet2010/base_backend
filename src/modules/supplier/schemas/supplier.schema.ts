import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const SUPPLIER_MODEL = 'supplier';

@Schema({ timestamps: true, collection: SUPPLIER_MODEL })
export class Supplier {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  type_ps_id: string;

  @Prop({ required: false })
  desc: string;

  @Prop({ required: false })
  status: string;

  @Prop({ required: false, trim: true })
  address: string;

  @Prop({ required: false })
  policy: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;
}

export type SupplierDocument = Supplier & Document;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
