import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Product } from './schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product' })
  async find(@Query() query: GetProductDto): Promise<ResPagingDto<Product[]>> {
    return this.productService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create product' })
  async createProduct(@Body() body: CreateProductDto, @UserID() userId: string): Promise<void> {
    await this.productService.createProduct(body, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update product by id' })
  async updateProduct(@Param() param: IdDto, @Body() body: UpdateProductDto, @UserID() userId: string): Promise<void> {
    await this.productService.updateProduct(param.id, body, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many product by ids' })
  async deleteProducts(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.productService.deleteProducts(body.ids, userId);
  }
}
