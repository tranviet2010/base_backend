import { InjectModel } from '@nestjs/mongoose';
import { Type, TypeDocument } from './schemas/type.schema';
import { Model } from 'mongoose';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetTypeDto } from './dto/get-type.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Capacity } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { sortHistories } from 'src/shares/helpers/utils';
import { ServiceInfoService } from '../service-info/service-info.service';
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { MapServiceInfoDto } from '../service-info/dto/res-map-service-info.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<Capacity>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    private serviceInfoService: ServiceInfoService,
  ) {}

  async find(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    const query = await this.buildQuery(param);
    // get type and service info
    const [types, total] = await Promise.all([this.findType(query, param), this.countServiceInfos(query)]);

    // get service info
    const typeInfo = await Promise.all(
      types.map(async (type: any) => {
        const queryService = this.buildQueryService(type.id);
        // get service
        const services = await this.findServiceInfos(queryService);

        // service info
        const serviceIds = services.map((_: any) => _.id);

        // format serviceInfo
        const mapServiceInfos = this.serviceInfoService.mapServicesInfo(services);

        // get list product
        const products = await this.findProductByServiceInfoIds(serviceIds, param, type);

        // format product
        const mapProduct = this.formatProducts(mapServiceInfos, products);
        return {
          type_name: type.name,
          products: mapProduct,
        };
      }),
    );

    return {
      result: typeInfo,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  formatProducts(mapServiceInfos: MapServiceInfoDto[], products: Product[]): any[] {
    const result = [];
    for (const p of products) {
      const s = mapServiceInfos.find((_) => {
        if (_._id === p['service_info_id'].toString()) {
          return _;
        }
      });

      if (!s) {
        continue;
      }
      const unit: any = p?.unit_id;

      result.push({
        name: s?.name,
        id: p['_id'],
        imei: p?.imei,
        iccid: p?.iccid,
        code: p?.code,
        producer_name: s?.producer_name,
        producer_id: s?.producer_id,
        service_info_name: s?.name,
        service_info_id: s?._id,
        buy_type: s?.type,
        group_name: s?.service_group_name,
        group_id: s?.service_group_id,
        capacity_name: s?.capacity_name,
        capacity_id: s?.capacity_id,
        contract_id: s?.contract_id,
        contract_name: s?.contract_name,
        import_date: p?.import_date,
        contract_expire_date: p?.contract_expire_date,
        selling_info: {
          deposit: s?.selling_info?.deposit,
          total: s?.selling_info?.total,
        },
        saihakko_fee: p?.saihakko_fee.toString(),
        selling_fee: {
          unit_name: s?.selling_fee?.unit_name,
          unit_id: s?.selling_fee?.unit_id,
          price: s?.selling_fee?.price,
        },
        active_date: p?.active_date,
        status: p?.status,
        inactive_date: p?.inactive_date,
        desc: p?.desc,
        producer: s?.producer_info.producer,
        supplier: p?.supplier_id,
        buying_price: p?.buying_price.toString(),
        unit_name: unit?.name,
        unit_id: unit?.id,
        histories: sortHistories(p?.histories || []),
        image_url: s?.image_url,
        ID: p?.ID,
      });
    }

    return result;
  }

  async findServiceInfos(query: any): Promise<ServiceInfo[]> {
    return this.serviceInfoModel
      .find(query)
      .select('-__v -updatedAt -deleted')
      .populate([
        {
          path: 'capacity_id',
          model: this.capacityModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'contract_id',
          model: this.contractModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'type_service_id',
          model: this.typeModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'service_group_id',
          model: this.groupModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'type_service_use_id',
          model: this.typeUseModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'producer_info',
          populate: [{ path: 'producer_id', model: this.producerModel, select: '-__v -createdAt -updatedAt -deleted' }],
        },
        { path: 'selling_fee', populate: [{ path: 'unit_id', model: this.unitModel }] },
        {
          path: 'histories',
          populate: [
            { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
            { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
            { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
          ],
        },
      ])
      .sort({ createdAt: -1 })
      .exec();
  }

  buildQueryService(typeId: string): any {
    const query: any = { deleted: false };

    if (typeId) {
      query.type_service_id = typeId;
    }

    return query;
  }

  async buildQuery(param: GetTypeDto): Promise<any> {
    const { name, id, type, code } = param;

    const query: any = { deleted: false };

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (id) {
      query._id = id;
    }

    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }

    if (code) {
      query.code = { $regex: code, $options: 'i' };
    }

    return query;
  }

  async findType(query: any, param: GetTypeDto): Promise<Type[]> {
    return this.typeModel
      .find(query)
      .skip((param.page - 1) * param.limit)
      .limit(param.limit)
      .sort({ createdAt: param.sort });
  }

  async countServiceInfos(query: any): Promise<number> {
    return this.typeModel.find(query).countDocuments();
  }

  async findProductByServiceInfoIds(serviceIds: string[], param: GetTypeDto, type: Type): Promise<Product[]> {
    const { limit, page } = this.getProductPaging(param, type);
    return await this.productModel
      .find({ service_info_id: { $in: serviceIds } })
      .populate([
        { path: 'unit_id', model: this.unitModel },
        { path: 'supplier_id', model: this.supplierModel },
        {
          path: 'histories',
          populate: [
            { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
            { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
            { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
          ],
        },
      ])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  buildQueryProduct(mapType: any, serviceIds: string[]): any {
    const query: any = {};
    query.service_info_id = mapType?._id;
    if (serviceIds) {
      query._id = { $in: serviceIds };
    }

    return query;
  }

  async findProducts(query: any, page: number, limit: number): Promise<Product[]> {
    return await this.productModel
      .find(query)
      .populate([{ path: 'buying_fee', populate: [{ path: 'unit_id', model: this.unitModel }] }])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async countProductInfos(query: any): Promise<number> {
    return this.productModel.find(query).countDocuments();
  }

  getProductPaging(param: GetTypeDto, type: any): { page: number; limit: number } {
    let page = 1;
    let limit = 10;
    if (param[`${type['id']}_page`]) {
      page = param[`${type['id']}_page`];
    }
    if (param[`${type['id']}_limit`]) {
      limit = param[`${type['id']}_limit`];
    }
    return { page, limit };
  }

  async createType(createCapacityDto: CreateTypeDto): Promise<void> {
    await this.typeModel.create(createCapacityDto);
  }

  async updateType(_id: string, updateTypeDto: UpdateTypeDto): Promise<void> {
    const type = await this.typeModel.findOne({ _id });
    if (!type) {
      throw new BadRequestException(httpErrors.TYPE_NOT_FOUND);
    }
    this.typeModel.findOneAndUpdate({ _id }, updateTypeDto, { new: true });
  }
}
