import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const UNITS_MODEL = 'units';
@Schema({ timestamps: true, collection: UNITS_MODEL })
export class Unit {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  desc: string;
}

export type UnitDocument = Unit & Document;
export const UnitSchema = SchemaFactory.createForClass(Unit);
