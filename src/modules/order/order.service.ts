import { Injectable, BadRequestException } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { httpErrors } from 'src/shares/exceptions';
import { GetClientOrderDto, GetOrderDto } from './dto/get-orders.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateOrderDto } from './dto/client-create-order.dto';
import { UpdatePromotionDto } from '../promotion/dto/update-promotion.dto';
import { CreatePromotionDto } from '../promotion/dto/create-promotion.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async getClientOrder(client_id: string, getClientOrderDto: GetClientOrderDto): Promise<ResPagingDto<Order[]>> {
    const { sort, page, limit, order_id } = getClientOrderDto;
    const query: any = {};
    query.client_id = client_id;

    if (order_id) {
      query._id = order_id;
    }

    const [result, total] = await Promise.all([
      this.orderModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.orderModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async find(getOrderDto: GetOrderDto): Promise<ResPagingDto<Order[]>> {
    const { sort, page, limit, user_id, client_id, order_id } = getOrderDto;
    const query: any = {};

    if (user_id) {
      query.user_id = user_id;
    }

    if (client_id) {
      query.client_id = client_id;
    }

    if (order_id) {
      query._id = order_id;
    }

    const [result, total] = await Promise.all([
      this.orderModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.orderModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async clientCreateOrder(createOrderDto: CreateOrderDto, userId: string): Promise<void> {
    await this.orderModel.create(createOrderDto);
  }

  async adminCreateOrder(createOrderDto: CreateOrderDto, userId: string): Promise<void> {
    await this.orderModel.create(createOrderDto);
  }

  async createPromotion(promotionalDto: CreatePromotionDto): Promise<void> {
    await this.orderModel.create(promotionalDto);
  }

  async updatePromotion(_id: string, updatePromotionDto: UpdatePromotionDto): Promise<void> {
    const promotion = await this.orderModel.findOne({ _id });
    if (!promotion) {
      throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate({ _id }, updatePromotionDto);
  }

  async deleteById(_id: string, delete_by: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }
}
