/*
https://docs.nestjs.com/controllers#controllers
*/

import { Get, Post, Body, Controller, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './schemas/menu.schema';

@Controller('menu')
export class MenuController {
    constructor(private readonly menusService: MenuService) { }
    @Post()
    async create(@Body() menu: Menu): Promise<any> {
        return this.menusService.createMenu(menu);
    }
    @Get()
    async findAll(@Query() query: string): Promise<any> {
        return this.menusService.findAllMenus(query);
    }
}
