import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { Model } from 'mongoose';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { httpErrors } from 'src/shares/exceptions';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GetGroupDto } from './dto/get-group.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Capacity } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<Capacity>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findGroup(param: GetGroupDto): Promise<ResPagingDto<Group[]>> {
    const query = this.buildQuery(param);
    const [group, total] = await Promise.all([this.findGroupInfos(query, param), this.countGroup(query)]);

    return {
      result: group,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async countGroup(query: any): Promise<number> {
    return this.groupModel.find(query).countDocuments();
  }

  async findGroupInfos(query: any, param: GetGroupDto): Promise<Group[]> {
    return this.groupModel
      .aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'service_infos',
            localField: '_id',
            foreignField: 'service_group_id',
            as: 'serviceInfos',
          },
        },
        {
          $project: {
            __v: 0,
            updatedAt: 0,
            deleted: 0,
          },
        },
        {
          $skip: (param.page - 1) * param.limit,
        },
        {
          $limit: param.limit,
        },
        {
          $sort: {
            createdAt: param.sort,
          },
        },
      ])
      .exec();
  }

  buildQuery(param: GetGroupDto): any {
    const { name, id, type, code } = param;
    const query: any = {};

    if (name) {
      query.name = name;
    }

    if (code) {
      query.code = code;
    }

    if (type) {
      query.type = type;
    }

    if (id) {
      query._id = id;
    }

    return query;
  }

  async createServiceGroup(payload: CreateGroupDto): Promise<void> {
    await this.groupModel.create(payload);
  }

  async updateServiceGroup(_id: string, payload: UpdateGroupDto): Promise<Group> {
    const service = await this.groupModel.findOne({ _id });
    if (!service) {
      throw new BadRequestException(httpErrors.SERVICE_INFO_GROUP_NOT_FOUND);
    }
    return this.groupModel.findOneAndUpdate({ _id }, payload, { new: true });
  }

  async deleteServiceGroup(_id: string, delete_by: string): Promise<void> {
    const service = await this.groupModel.findById(_id);
    if (!service) {
      throw new BadRequestException(httpErrors.SERVICE_INFO_GROUP_NOT_FOUND);
    }
    await this.groupModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }
}
