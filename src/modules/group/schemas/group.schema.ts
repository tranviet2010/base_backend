import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export const GROUP_MODEL = 'group';

@Schema({ timestamps: true, collection: GROUP_MODEL })
export class Group {
  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  desc?: string;

  @Prop({ required: false })
  code?: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: TypeTypeEnum })
  type: TypeTypeEnum;
}

export type GroupDocument = Group & Document;
export const GroupSchema = SchemaFactory.createForClass(Group);
