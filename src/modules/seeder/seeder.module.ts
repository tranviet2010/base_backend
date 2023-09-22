import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AdminSeeder } from './admin-seeder.console';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Param, ParamSchema } from '../param/schemas/param.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { UsersModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Capacity.name, schema: CapacitySchema }]),
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }]),
    MongooseModule.forFeature([{ name: Param.name, schema: ParamSchema }]),
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: ServiceInfo.name, schema: ServiceInfoSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: TypeUse.name, schema: TypeUseSchema }]),
    MongooseModule.forFeature([{ name: ProductInfo.name, schema: ProductInfoSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Producer.name, schema: ProducerSchema }]),
    UsersModule,
    ClientModule,
  ],
  providers: [SeederService, AdminSeeder],
})
export class SeederModule {}
