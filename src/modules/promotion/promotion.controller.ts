import { Controller, Post, Patch, Delete, Body, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { GetPromotion } from './dto/get-promotion.dto';
import { Promotion } from './schemas/promotion.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all promotion and paging' })
  async findAll(@Query() query: GetPromotion): Promise<ResPagingDto<Promotion[]>> {
    return this.promotionService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create promotion' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() createPromotionDto: CreatePromotionDto): Promise<void> {
    await this.promotionService.createPromotion(createPromotionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] update promotion by id' })
  @ApiBearerAuth()
  async update(@Param() param: IdDto, @Body() updatePromotionDto: UpdatePromotionDto): Promise<void> {
    await this.promotionService.updatePromotion(param.id, updatePromotionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[ ADMIN ] delete promotion by id' })
  @ApiBearerAuth()
  async delete(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.promotionService.deletePromotion(param.id, userId);
  }
}
