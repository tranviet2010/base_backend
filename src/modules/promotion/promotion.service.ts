import { Injectable, BadRequestException } from '@nestjs/common';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { httpErrors } from 'src/shares/exceptions';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { GetPromotion } from './dto/get-promotion.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class PromotionService {
  constructor(@InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>) {}

  async find(getPromotion: GetPromotion): Promise<ResPagingDto<Promotion[]>> {
    const { sort, page, limit, status, name, id } = getPromotion;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (name) {
      query.name = name;
    }

    if (id) {
      query._id = id;
    }

    const [result, total] = await Promise.all([
      this.promotionModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.promotionModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createPromotion(promotionalDto: CreatePromotionDto): Promise<void> {
    await this.promotionModel.create(promotionalDto);
  }

  async updatePromotion(_id: string, updatePromotionDto: UpdatePromotionDto): Promise<void> {
    const promotion = await this.promotionModel.findOne({ _id });
    if (!promotion) {
      throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
    }
    await this.promotionModel.findOneAndUpdate({ _id }, updatePromotionDto);
  }

  async deletePromotion(_id: string, delete_by: string): Promise<void> {
    const promotion = await this.promotionModel.findOne({ _id });
    if (!promotion) {
      throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
    }
    await this.promotionModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }
}
