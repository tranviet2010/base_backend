import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Shipping, ShippingDocument } from './schemas/shipping.schema';
import { Model } from 'mongoose';
import { GetShippingDto } from './dto/get-shipping.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpDateShippingDto } from './dto/update-shipping.dto';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class ShippingService {
  constructor(@InjectModel(Shipping.name) private shippingModel: Model<ShippingDocument>) {}

  async find(getShippingDto: GetShippingDto): Promise<ResPagingDto<Shipping[]>> {
    const { sort, page, limit, name } = getShippingDto;
    const query: any = {};

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.shippingModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.shippingModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createShipping(createShippingDto: CreateShippingDto): Promise<void> {
    await this.shippingModel.create(createShippingDto);
  }

  async updateShipping(_id: string, body: UpDateShippingDto): Promise<void> {
    const shipping = await this.shippingModel.findOne({ _id });
    if (!shipping) {
      throw new BadRequestException(httpErrors.SHIPPING_NOT_FOUND);
    }
    await this.shippingModel.findOneAndUpdate({ _id }, body);
  }
}
