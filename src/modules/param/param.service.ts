import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Param, ParamDocument } from './schemas/param.schema';
import { Model } from 'mongoose';
import { CreateParamDto } from './dto/create-param.dto';
import { UpdateParamDto } from './dto/update-param.dto';
import { httpErrors } from 'src/shares/exceptions';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { GetParamDto, GetParamInfoDto } from './dto/get-param.dto';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Capacity, CapacityDocument } from '../capacity/schemas/capacity.schema';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { BuyType } from 'src/shares/enums/service-info.enum';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';

@Injectable()
export class ParamService {
  constructor(
    @InjectModel(Param.name) private paramModel: Model<ParamDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<CapacityDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
  ) {}

  async getInfoParam(query: GetParamInfoDto): Promise<any> {
    const { type } = query;
    const queryType: any = {};
    const queryGroup: any = {};
    const queryTypeUse: any = {};
    const buy_type = Object.keys(BuyType).reduce((object, key) => {
      const value = BuyType[key];
      return { ...object, [key]: value };
    }, {});

    if (type) {
      queryType.type = type;
      queryGroup.type = type;
      queryTypeUse.type = type;
    }
    const [capacities, type_, group, suppliers, units, contracts, devices, type_uses, producers] = await Promise.all([
      this.capacityModel.find({ deleted: false }),
      this.typeModel
        .aggregate([
          { $match: queryTypeUse },
          {
            $lookup: {
              from: 'service_infos',
              localField: '_id',
              foreignField: 'type_service_id',
              as: 'service_infos',
            },
          },
        ])
        .exec(),
      this.GroupModel.find({ deleted: false, ...queryGroup }),
      this.supplierModel.find({ deleted: false }),
      this.unitModel.find({ deleted: false }),
      this.contractModel.find({ deleted: false }),
      this.deviceModel.find({ deleted: false }),
      this.typeUseModel.find({ deleted: false, ...queryType }),
      this.producerModel.find({ deleted: false }),
    ]);

    return {
      units,
      capacities,
      contracts,
      devices:
        devices.map((_: any) => {
          const { _id, name, status, desc, buying_price, selling_price, deleted, createdAt, updatedAt } = _;
          return {
            _id,
            name,
            status,
            desc,
            buying_price: buying_price.toString(),
            selling_price: selling_price.toString(),
            deleted,
            createdAt,
            updatedAt,
          };
        }) || [],
      type: type_.map((t) => {
        const service_infos = t.service_infos.map((s) => {
          return { name: s.name, _id: s._id };
        });
        return { ...t, service_infos };
      }),
      group: group,
      suppliers,
      producers,
      type_uses: type_uses,
      buy_type,
    };
  }

  async findOne(query: GetParamDto): Promise<any> {
    const { name } = query;

    const [param, units, contracts, devices] = await Promise.all([
      this.paramModel
        .findOne({ name })
        .select('-__v -createdAt -updatedAt +_id')
        .populate([
          {
            path: 'capacities',
            model: this.capacityModel,
            select: 'name _id',
            match: { deleted: false },
          },
          {
            path: 'types',
            model: this.typeModel,
            select: '_id name desc code type',
            match: { deleted: false },
          },
          {
            path: 'groups',
            model: this.GroupModel,
            select: 'name _id code type',
            match: { deleted: false },
          },
          {
            path: 'suppliers',
            model: this.supplierModel,
            select: 'name _id',
            match: { deleted: false },
          },
          {
            path: 'type_uses',
            model: this.typeUseModel,
            select: 'name _id type',
          },
        ])
        .exec(),
      this.unitModel.find({ deleted: false }),
      this.contractModel.find({ deleted: false }),
      this.deviceModel.find({ deleted: false }),
    ]);

    if (!param) {
      throw new BadRequestException(httpErrors.PARAM_NOT_FOUND);
    }

    return {
      _id: param._id,
      capacities: param?.capacities || [],
      type: param?.types || [],
      type_uses: param?.type_uses || [],
      group: param?.groups || [],
      suppliers: param?.suppliers || [],
      units: units || [],
      contracts: contracts || [],
      devices:
        devices.map((_: any) => {
          const { _id, name, status, desc, buying_price, selling_price, deleted, createdAt, updatedAt } = _;
          return {
            _id,
            name,
            status,
            desc,
            buying_price: buying_price.toString(),
            selling_price: selling_price.toString(),
            deleted,
            createdAt,
            updatedAt,
          };
        }) || [],
    };
  }

  async createParam(createParamDto: CreateParamDto): Promise<void> {
    await this.paramModel.create(createParamDto);
  }

  async updateParam(_id: string, updateParamDto: UpdateParamDto): Promise<Param> {
    const param = await this.paramModel.findOne({ _id });
    if (!param) {
      throw new BadRequestException(httpErrors.PARTNER_NOT_FOUND);
    }
    return await this.paramModel.findOneAndUpdate({ _id }, updateParamDto, { new: true });
  }

  async deleteParam(_id: string): Promise<void> {
    await this.paramModel.findOneAndDelete({ _id });
  }
}
