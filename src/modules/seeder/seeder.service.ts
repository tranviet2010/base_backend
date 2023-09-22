import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Capacity, CapacityDocument } from '../capacity/schemas/capacity.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { Param, ParamDocument } from '../param/schemas/param.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { capacityData } from './data/capacity.data';
import { contractData } from './data/contract.data';
import { deviceData } from './data/device.data';
import { paramData } from './data/param.data';
import { serviceGroup } from './data/group.data';
import { productGroup } from './data/group.data';
import { supplierData } from './data/supplier.data';
import { serviceType, productType } from './data/type.data';
import { unitData } from './data/unit.data';
import { userData } from './data/user.data';
import { clientData } from './data/client.data';
import { typeServiceUse, typeProductUse } from './data/type-use.data';
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { UserService } from '../user/user.service';
import { ClientService } from '../client/client.service';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { productInfoData } from './data/product-info.data';
import { serviceInfoData } from './data/service-info.data';
import { productData } from './data/product.data';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';
import { producerData } from './data/producer.data';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<CapacityDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Param.name) private paramModel: Model<ParamDocument>,
    @InjectModel(Unit.name) private uniteModel: Model<UnitDocument>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(TypeUse.name) private typeServiceUseModel: Model<TypeUseDocument>,
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    private userService: UserService,
    private clientService: ClientService,
  ) {}

  async createSeeder(): Promise<void> {
    // create user
    const user = await this.userService.createUser(userData[0]);
    await this.clientService.createClient(clientData[0]);

    const [
      capacities,
      service_type,
      service_group,
      suppliers,
      units,
      contracts,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      devices,
      type_service_uses,
      producers,
    ] = await Promise.all([
      this.capacityModel.create(capacityData),
      this.typeModel.create(serviceType),
      this.GroupModel.create(serviceGroup),
      this.supplierModel.create(supplierData),
      this.uniteModel.create(unitData),
      this.contractModel.create(contractData),
      this.deviceModel.create(
        deviceData.map((_: any) => {
          _.histories = [{ create_by: user._id, info: JSON.stringify(_), created_at: new Date() }];
          return _;
        }),
      ),
      this.typeServiceUseModel.create(typeServiceUse),
      this.producerModel.create(producerData),
    ]);

    const [product_groups, product_types, type_product_uses] = await Promise.all([
      this.GroupModel.create(productGroup),
      this.typeModel.create(productType),
      this.typeServiceUseModel.create(typeProductUse),
    ]);

    const idsCapacities = capacities.map((_) => _._id);
    const idsTypeServices = service_type.map((_) => _._id);
    const idsTypeServiceUse = type_service_uses.map((_) => _._id);
    const idsServiceGroup = service_group.map((_) => _._id);
    const idsSupplier = suppliers.map((_) => _._id);

    // create param info
    await this.paramModel.create({
      name: paramData[0].name,
      capacities: idsCapacities,
      types: idsTypeServices,
      type_uses: idsTypeServiceUse,
      groups: idsServiceGroup,
      suppliers: idsSupplier,
    });

    // create service info
    const serviceInfoNews = await Promise.all(
      serviceInfoData.map(async (_) => {
        const group_id = Math.floor(Math.random() * (service_group.length - 1));
        const serviceInfo: ServiceInfo = _;
        serviceInfo.capacity_id = capacities[0]._id;
        serviceInfo.contract_id = contracts[0]._id;
        serviceInfo.type_service_id = service_type[0]._id;
        serviceInfo.type_service_use_id = type_service_uses[0]._id;
        serviceInfo.service_group_id = service_group[group_id]._id;
        serviceInfo.producer_info.producer_id = producers[0]._id;
        serviceInfo.selling_fee.unit_id = units[0]._id;
        serviceInfo.histories = [{ create_by: user._id, info: JSON.stringify(serviceInfo), created_at: new Date() }];

        return this.serviceInfoModel.create(serviceInfo);
      }),
    );

    // create product info
    const payloadProductInfo = {
      ...productInfoData[0],
      product_type_id: product_types[0]._id,
      group_id: product_groups[0]._id,
      type_product_use_id: type_product_uses[0]._id,
      unit_id: units[0]._id,
      producer_info: {
        producer_id: producers[0].id,
        product_production_location: productInfoData[0].producer_info.product_production_location,
      },

      selling_exchanges: [
        {
          exchange_type: productInfoData[0].selling_exchanges[0].exchange_type,
          price: productInfoData[0].selling_exchanges[0].price,
          quantity: productInfoData[0].selling_exchanges[0].quantity,
          unit_id: units[0].id,
        },
      ],
    };
    const productInfo: ProductInfo = {
      ...payloadProductInfo,
      histories: [{ create_by: user._id, info: JSON.stringify(payloadProductInfo), created_at: new Date() }],
    };

    await this.productInfoModel.create(productInfo);

    // create product
    await Promise.all(
      productData.map(async (_) => {
        const serviceIndex = Math.floor(Math.random() * (serviceInfoNews.length - 1));
        const unitIndex = Math.floor(Math.random() * (units.length - 1));
        const suppliersIndex = Math.floor(Math.random() * (suppliers.length - 1));
        const payloadProduct: any = _;
        payloadProduct.service_info_id = serviceInfoNews[serviceIndex]?.id;
        payloadProduct.unit_id = units[unitIndex]?.id;
        payloadProduct.histories = [
          { create_by: user._id, info: JSON.stringify(payloadProduct), created_at: new Date() },
        ];
        payloadProduct.supplier_id = suppliers[suppliersIndex]?.id;
        const product: Product = {
          ...payloadProduct,
        };
        await this.productModel.create(product);
      }),
    );
  }
}
