import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export const MENU = 'menu';


export class MenuItem {
    @Prop()
    name: string;

    @Prop()
    url: string;

    @Prop()
    role: number;
}

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true, collection: MENU })
export class Menu {
    @Prop()
    name: string;

    @Prop()
    children: MenuItem[];
}

export const MenuSchema = SchemaFactory.createForClass(Menu);