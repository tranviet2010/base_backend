import { Cruds, CrudsDocument } from './schemas/crud.schema';
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CrudService {
    constructor(@InjectModel(Cruds.name) private readonly crudModel: Model<CrudsDocument>) { }

    async create(crud: Cruds): Promise<void> {
        const createdCat = new this.crudModel(crud);
        createdCat.save();
    }
    async findAll(query:any) {
        let value = await this.crudModel.find(query).exec()
        return value
    }
}