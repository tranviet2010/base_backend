import { Controller, Post, Patch, Body, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetShippingDto } from './dto/get-shipping.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Shipping } from './schemas/shipping.schema';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpDateShippingDto } from './dto/update-shipping.dto';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shipping' })
  async finds(@Query() query: GetShippingDto): Promise<ResPagingDto<Shipping[]>> {
    return this.shippingService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create shipping' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() createShippingDto: CreateShippingDto): Promise<void> {
    await this.shippingService.createShipping(createShippingDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] update shipping by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async update(@Param() param: IdDto, @Body() UpdateShippingDto: UpDateShippingDto): Promise<void> {
    await this.shippingService.updateShipping(param.id, UpdateShippingDto);
  }
}
