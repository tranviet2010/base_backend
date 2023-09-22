import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from './schemas/type.schema';
import { TypeService } from './type.service';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { ServiceInfoModule } from '../service-info/service-info.module';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
    MongooseModule.forFeature([{ name: ServiceInfo.name, schema: ServiceInfoSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Capacity.name, schema: CapacitySchema }]),
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]),
    MongooseModule.forFeature([{ name: TypeUse.name, schema: TypeUseSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Producer.name, schema: ProducerSchema }]),
    ServiceInfoModule,
  ],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
