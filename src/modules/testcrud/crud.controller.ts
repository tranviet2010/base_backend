/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CrudService } from './crud.service';
import { Cruds } from './schemas/crud.schema';

@Controller('crud')
export class CrudController {
    constructor(private readonly crudsService: CrudService) { }
    @Get()
    async findAll(@Query() query: string): Promise<any> {
        return this.crudsService.findAll(query)
    }

    @Post()
    async create(@Body() crud: Cruds): Promise<void> {
        await this.crudsService.create(crud);
    }

}
