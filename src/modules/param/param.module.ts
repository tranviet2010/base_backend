import { Module } from '@nestjs/common';
import { ParamController } from './param.controller';
import { ParamService } from './param.service';
import { Param, ParamSchema } from './schemas/param.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Param.name, schema: ParamSchema }]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Supplier.name, schema: SupplierSchema }]),
    MongooseModule.forFeature([{ name: Type.name, schema: TypeSchema }]),
    MongooseModule.forFeature([{ name: Capacity.name, schema: CapacitySchema }]),
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Contract.name, schema: ContractSchema }]),
    MongooseModule.forFeature([{ name: TypeUse.name, schema: TypeUseSchema }]),
    MongooseModule.forFeature([{ name: Producer.name, schema: ProducerSchema }]),
  ],
  controllers: [ParamController],
  providers: [ParamService],
})
export class ParamModule {}
