/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CrudService } from './crud.service';
import { Cruds } from './schemas/crud.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';

@ApiTags('Crud')
@Controller('crud')
export class CrudController {
    constructor(private readonly crudsService: CrudService) { }
    @Get()
    @UserAuth()
    async findAll(@Query() query: string): Promise<any> {
        return this.crudsService.findAll(query)
    }

    @Post()
    @ClientAuth()
    @UserAuth([UserRole.admin])
    async create(@Body() crud: Cruds): Promise<void> {
        await this.crudsService.create(crud);
    }

}
