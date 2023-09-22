import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


export const CRUD_MODEL = 'crud';

@Schema({ timestamps: true, collection: CRUD_MODEL })
export class Cruds {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
    quantity: string;

    @Prop({ required: true })
    code: string;
}

export type CrudsDocument = Cruds & Document;

export const CrudSchema = SchemaFactory.createForClass(Cruds);



