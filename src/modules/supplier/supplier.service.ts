import { Injectable, BadRequestException } from '@nestjs/common';
import { Supplier, SupplierDocument } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { httpErrors } from 'src/shares/exceptions';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetSupplierDto } from './dto/get-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(@InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>) { }

  async find(getSupplierDto: GetSupplierDto): Promise<ResPagingDto<Supplier[]>> {
    const { sort, page, limit, id, name } = getSupplierDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.supplierModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.supplierModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<void> {
    await this.supplierModel.create(createSupplierDto);
  }

  async updateSupplier(_id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierModel.findOne({ _id });
    if (!supplier) {
      throw new BadRequestException(httpErrors.SUPPLIER_NOT_FOUND);
    }
    return await this.supplierModel.findOneAndUpdate({ _id }, updateSupplierDto, { new: true });
  }

  async deleteSupplier(_id: string, delete_by: string): Promise<void> {
    const supplier = await this.supplierModel.findById(_id);
    if (!supplier) {
      throw new BadRequestException(httpErrors.SUPPLIER_NOT_FOUND);
    }
    await this.supplierModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }
}
