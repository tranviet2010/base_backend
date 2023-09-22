import { CrudSchema, Cruds } from './schemas/crud.schema';
import { CrudService } from './crud.service';
import { CrudController } from './crud.controller';


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Cruds.name, schema: CrudSchema }])],
    controllers: [
        CrudController],
    providers: [
        CrudService],
})
export class CrudModule { }
