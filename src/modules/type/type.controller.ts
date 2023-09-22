import { Controller, Post, Patch, Body, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { GetTypeDto } from './dto/get-type.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Type as TypeSchema } from './schemas/type.schema';
import { TypeService } from './type.service';

@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get Type' })
  async getParam(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] Create Type' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async createType(@Body() createCapacityDto: CreateTypeDto): Promise<void> {
    await this.typeService.createType(createCapacityDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] Update Type' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateType(@Param() param: IdDto, @Body() updateTypeDto: UpdateTypeDto): Promise<void> {
    await this.typeService.updateType(param.id, updateTypeDto);
  }
}
