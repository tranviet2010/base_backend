import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PromotionalStatus } from 'src/shares/enums/promotional.enum';

export const PROMOTIONS_MODEL = 'promotions';

@Schema({ timestamps: true, collection: PROMOTIONS_MODEL })
export class Promotion {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true })
  code: string;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  percent_discount: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: String })
  gift?: string;

  @Prop({ required: false, enum: PromotionalStatus, default: PromotionalStatus.ACTIVE })
  status: PromotionalStatus;

  @Prop({ required: true, type: MongooseSchema.Types.Date })
  start_date: MongooseSchema.Types.Date;

  @Prop({ required: true, type: MongooseSchema.Types.Date })
  expiration_date: MongooseSchema.Types.Date;
}

export type PromotionDocument = Promotion & Document;
export const PromotionSchema = SchemaFactory.createForClass(Promotion);
