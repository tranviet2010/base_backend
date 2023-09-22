import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ServiceInfoService } from './service-info.service';
import { CreateServiceInfoDto } from './dto/create-service-info.dto';
import { UpdateServiceInfoDto } from './dto/update-service-info.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetServiceInfoDto } from './dto/get-service-info.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { DeleteServiceInfosDto } from './dto/delete-service-info.dto';
import { ResFormatServiceInfoDto } from './dto/res-format-service-info.dto';
import { MapServiceInfoDto } from './dto/res-map-service-info.dto';
import { Response } from 'express';

@ApiTags('Service Info')
@Controller('service-info')
export class ServiceInfoController {
  constructor(private serviceInfoService: ServiceInfoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all service info' })
  async find(@Query() query: GetServiceInfoDto): Promise<ResPagingDto<MapServiceInfoDto[]>> {
    return this.serviceInfoService.find(query);
  }

  @Get('excel')
  @ApiOperation({ summary: 'Get all service info' })
  async exportFileExcel(@Query() query: GetServiceInfoDto, @Res() res: Response): Promise<void> {
    return this.serviceInfoService.exportFileExcel(query, res);
  }

  @Get('/product')
  @ApiOperation({ summary: 'Get all product in service info' })
  async findProductInServiceInfo(@Query() query: GetServiceInfoDto): Promise<ResPagingDto<ResFormatServiceInfoDto[]>> {
    return this.serviceInfoService.getProductOfServiceInfo(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create service info' })
  async createServiceInfo(@Body() body: CreateServiceInfoDto, @UserID() userId: string): Promise<void> {
    await this.serviceInfoService.createServiceInfo(body, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update service info by id' })
  async updateServiceInfo(
    @Param() param: IdDto,
    @Body() body: UpdateServiceInfoDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.serviceInfoService.updateServiceInfo(param.id, body, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete service info by id' })
  async deleteServiceInfo(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.serviceInfoService.deleteServiceInfo(param.id, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many service info' })
  async deleteServiceInfos(@Body() body: DeleteServiceInfosDto, @UserID() userId: string): Promise<void> {
    await this.serviceInfoService.deleteServiceInfos(body.ids, userId);
  }
}
