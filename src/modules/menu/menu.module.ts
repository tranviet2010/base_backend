import { MongooseModule } from '@nestjs/mongoose';

/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }])],
    controllers: [MenuController],
    providers: [
        MenuService,],
})
export class MenuModule { }
