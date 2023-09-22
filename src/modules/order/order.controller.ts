import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { OrderService } from './order.service';
import { GetClientOrderDto, GetOrderDto } from './dto/get-orders.dto';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/client-create-order.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Order')
@Controller('order')
// @ClientAuth()
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Get('my-order')
  // @ApiBearerAuth()
  // @ClientAuth()
  @ApiOperation({ summary: `Client Get order` })
  async getClientOrder(@UserID() userId: string, @Query() query: GetClientOrderDto): Promise<ResPagingDto<Order[]>> {
    return this.orderService.getClientOrder(userId, query);
  }

  @Get()
  @ApiOperation({ summary: `[Admin] Get all order` })
  // @ApiBearerAuth()
  // @UserAuth([UserRole.admin])
  async find(@Query() query: any): Promise<ResPagingDto<Order[]>> {
    return this.orderService.find(query);
  }


  @Post()
  @ApiOperation({ summary: 'Client create order' })
  // // @ApiBearerAuth()
  // @ClientAuth()
  async clientCreate(@Body() createOrderDto: CreateOrderDto, @UserID() userId: string): Promise<void> {
    await this.orderService.clientCreateOrder(createOrderDto, userId);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create order' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async adminCreate(@Body() createOrderDto: CreateOrderDto, @UserID() userId: string): Promise<void> {
    // await this.orderService.adminCreateOrder(createOrderDto, userId);
  }

  // todo user can delete order when status order  ==?
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete order by id' })
  // @ApiBearerAuth()
  // @ClientAuth()
  async deleteCart(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.orderService.deleteById(param.id, userId);
  }
}
