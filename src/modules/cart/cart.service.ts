import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetCartDto } from './dto/get-cart.dto';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { CartRepository } from './repositories/cart.repositories';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(ProductInfo.name) private productModel: Model<ProductInfoDocument>,
    private cartRepository: CartRepository,
  ) {}

  async createCart(createCartDto: CreateCartDto, user_id: string): Promise<Cart> {
    const { product_id } = createCartDto;
    const product = await this.productModel.findById(product_id);
    const cart = await this.cartModel.findOne({ user_id, product_id });

    if (!product) {
      throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
    }

    if (!cart) {
      throw new BadRequestException(httpErrors.CART_EXISTED);
    }

    return this.cartModel.create({
      product_id,
      user_id,
    });
  }

  async find(getCartDto: GetCartDto, user_id: string): Promise<ResPagingDto<Cart[]>> {
    const { sort, page, limit, id } = getCartDto;
    const query: any = {};
    query.user_id = user_id;

    if (id) {
      query._id = id;
    }

    const [result, total] = await Promise.all([
      this.cartModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.cartModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async deleteById(_id: string, user_id: string): Promise<void> {
    await this.cartModel.deleteOne({ _id, user_id });
  }
}
