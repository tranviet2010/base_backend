import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { httpErrors } from 'src/shares/exceptions';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { sortHistories } from 'src/shares/helpers/utils';
import { ServiceInfoService } from '../service-info/service-info.service';
import { ProductInfoService } from '../product-info/product-info.service';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Capacity, CapacityDocument } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { ProductTypeEnum } from 'src/shares/enums/product.enum';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<CapacityDocument>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    private serviceInfoService: ServiceInfoService,
    private productInfoService: ProductInfoService,
  ) {}

  async find(param: GetProductDto): Promise<ResPagingDto<Product[]>> {
    const query = this.buildQuery(param);

    const [result, total] = await Promise.all([this.findProduct(query, param), this.countProduct(query)]);

    const productInfo = this.mapProduct(result);

    return {
      result: productInfo,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async countProduct(query: any): Promise<number> {
    return this.productModel.find(query).countDocuments();
  }

  async findProduct(query: any, param: GetProductDto): Promise<Product[]> {
    return this.productModel
      .find(query)
      .populate([
        {
          path: 'product_info_id',
          model: this.productInfoModel,
          select: '-__v  -deleted',
          populate: [
            {
              path: 'group_id',
              model: this.groupModel,
              select: '-__v  -deleted',
            },
            {
              path: 'type_product_use_id',
              model: this.typeUseModel,
              select: '-__v  -deleted',
            },
            {
              path: 'product_type_id',
              model: this.typeModel,
              select: '-__v  -deleted',
            },
            {
              path: 'unit_id',
              model: this.unitModel,
              select: '-__v  -deleted',
            },
            {
              path: 'producer_info',
              populate: [{ path: 'producer_id', model: this.producerModel, select: '-__v  -deleted' }],
            },
            {
              path: 'selling_exchange',
              populate: { path: 'unit_id', model: this.unitModel, select: '-__v  -deleted' },
            },
            {
              path: 'histories',
              populate: [
                { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
                { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
                { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
              ],
            },
            {
              path: 'buying_fee',
              populate: [{ path: 'unit_id', model: this.unitModel, select: '-__v  -deleted' }],
            },
          ],
        },
        {
          path: 'supplier_id',
          model: this.supplierModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
        },
        {
          path: 'service_info_id',
          model: this.serviceInfoModel,
          select: '-__v  -deleted',
          populate: [
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
              populate: [
                { path: 'producer_id', model: this.producerModel, select: '-__v -createdAt -updatedAt -deleted' },
              ],
            },
            {
              path: 'histories',
              populate: [
                { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
                { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
                { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
              ],
            },
          ],
        },
      ])
      .skip((param.page - 1) * param.limit)
      .limit(param.limit)
      .sort({ createdAt: param.sort });
  }

  private buildQuery(param: GetProductDto): any {
    const { id, name, code, type } = param;
    const query: any = {};
    query.deleted = false;

    if (type) {
      if (type === ProductTypeEnum.PRODUCT) query.product_info_id = { $ne: null };
      if (type === ProductTypeEnum.SERVICE) query.service_info_id = { $ne: null };
    }

    if (code) {
      query.code = code;
    }

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    return query;
  }

  mapProduct(products: Product[]): any[] {
    return products.map((product: any) => {
      console.log(product);
      const serviceInfo = product?.service_info_id;
      const productInfo = product?.product_info_id;
      const unit = product?.unit_id;
      return {
        _id: product?.id,
        ID: product?.ID,
        status: product?.status,
        name: product?.name,
        code: product?.code,
        deleted: product?.deleted,
        desc: product?.desc,
        currency: product?.currency,
        createdAt: product?.createdAt,
        supplier_id: product?.supplier_id?._id,
        supplier_name: product?.supplier_id?.name,
        product_info: productInfo ? this.productInfoService.mapProductInfo([productInfo])[0] : undefined,
        service_info: serviceInfo ? this.serviceInfoService.mapServicesInfo([serviceInfo])[0] : undefined,
        histories: sortHistories(product?.histories || []),
        imei: product?.imei,
        iccid: product?.iccid,
        import_date: product?.import_date,
        contract_expire_date: product?.contract_expire_date,
        active_date: product?.active_date,
        inactive_date: product?.inactive_date,
        saihakko_fee: product?.saihakko_fee,
        producer: product?.producer_id,
        unit_name: unit?.name,
        unit_id: unit?.id,
      };
    });
  }

  async updateProduct(id: string, payload: UpdateProductDto, update_by: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
    }

    payload['histories'] = [
      ...(product?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.productModel.findOneAndUpdate({ _id: id }, payload);
  }

  async createProduct(payload: CreateProductDto, create_by: string): Promise<void> {
    await this.productModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async deleteProducts(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const serviceInfo = await this.productModel.findById(id);

        if (!serviceInfo) {
          throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
        }

        const histories = [...(serviceInfo?.histories || []), { delete_by, created_at: new Date() }];

        await this.productModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
