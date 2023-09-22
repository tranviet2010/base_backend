import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export const TYPE_MODEL = 'types';

@Schema({ timestamps: true, collection: TYPE_MODEL })
export class Type {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({ required: true, type: Number, unique: true })
  code: number;

  @Prop({ required: true, enum: TypeTypeEnum })
  type: TypeTypeEnum;
}

export type TypeDocument = Type & Document;
export const TypeSchema = SchemaFactory.createForClass(Type);
