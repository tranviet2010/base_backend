import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ApiTags } from '@nestjs/swagger';
import { Shipping, ShippingSchema } from './schemas/shipping.schema';
import { PaymentMethod, PaymentMethodSchema } from './schemas/payment-method.schema';

@ApiTags('Order')
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Shipping.name, schema: ShippingSchema }]),
    MongooseModule.forFeature([{ name: PaymentMethod.name, schema: PaymentMethodSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderModule],
})
export class OrderModule {}
