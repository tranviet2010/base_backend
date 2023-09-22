import { BullModule } from '@nestjs/bull';
import { CacheModule, Logger } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { ConsoleModule } from 'nestjs-console';
import { mongodb } from 'src/configs/database.config';
import { redisConfig } from 'src/configs/redis.config';
import { EventModule } from 'src/modules/events/event.module';
import { HelloKafka } from 'src/modules/hello-kafka/hello-kafka.module';
import { HttpClientModule } from 'src/shares/http-clients/http.module';
import { KafkaModule } from 'src/shares/kafka-client/kafka-module';
import { UploadModule } from './modules/upload/upload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MessageModule } from './modules/message/message.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrderModule } from './modules/order/order.module';
import { ProductInfoModule } from './modules/product-info/product-info.module';
import { CartModule } from './modules/cart/cart.module';
import { DeviceModule } from './modules/device/device.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ParamModule } from './modules/param/param.module';
import { PaymentMethodModule } from './modules/payment-method/payment-method.module';
import { ServiceInfoModule } from './modules/service-info/service-info.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { ClientModule } from './modules/client/client.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { UnitModule } from './modules/unit/unit.module';
import { ContractModule } from './modules/contract/contract.module';
import { CapacityModule } from './modules/capacity/capacity.module';
import { TypeModule } from './modules/type/type.module';
import { ExcelModule } from './modules/excel/excel.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { DepartmentModule } from './modules/department/department.module';
import { Source } from './modules/source/schemas/source.schema';
import { GroupModule } from './modules/group/group.module';
import { TypeUseModule } from './modules/type-use/type-use.module';
import { ProductModule } from './modules/product/product.module';
import { ProducerModule } from './modules/producer/producer.module';
import { MenuModule } from './modules/menu/menu.module';
import { CrudModule } from './modules/testcrud/crud.module';

const Modules = [
  Logger,
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ScheduleModule.forRoot(),
  KafkaModule,
  ConsoleModule,
  HttpClientModule,
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  EventModule,
  AuthModule,
  HelloKafka,
  UploadModule,
  UsersModule,
  MailModule,
  MessageModule,
  CategoriesModule,
  OrderModule,
  ProductInfoModule,
  CartModule,
  PromotionModule,
  DeviceModule,
  SupplierModule,
  ServiceInfoModule,
  ParamModule,
  PaymentMethodModule,
  AttributesModule,
  ClientModule,
  ShippingModule,
  UnitModule,
  ContractModule,
  CapacityModule,
  TypeModule,
  ExcelModule,
  SeederModule,
  DepartmentModule,
  Source,
  GroupModule,
  TypeUseModule,
  ProductModule,
  ProducerModule,
  MenuModule,
  CrudModule,
];
export default Modules;
