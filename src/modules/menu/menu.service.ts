/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuItemDocument } from './schemas/menu.schema';
import { Model } from 'mongoose';

@Injectable()
export class MenuService {
    constructor(@InjectModel(Menu.name) private readonly menuModel: Model<MenuItemDocument>) { }

    async createMenu(menu: Menu): Promise<void> {
        const createdMenu = new this.menuModel(menu);
        createdMenu.save();
    }

    async findAllMenus(query: any) {
        return this.menuModel.find(query).exec();
    }
}
