import { Controller, Post, Patch, Body, Delete, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetSupplierDto } from './dto/get-supplier.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Supplier } from './schemas/supplier.schema';

@ApiTags('Supplier')
@Controller('supplier')
@ApiBearerAuth()
@UserAuth([UserRole.admin])
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  @ApiOperation({ summary: `[ ADMIN ] get supplier` })
  async find(@Query() query: GetSupplierDto): Promise<ResPagingDto<Supplier[]>> {
    return this.supplierService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create supplier' })
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto): Promise<void> {
    await this.supplierService.createSupplier(createSupplierDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '[ ADMIN ] update supplier by id' })
  async updateSupplier(@Param() param: IdDto, @Body() updateSupplierDto: UpdateSupplierDto): Promise<void> {
    await this.supplierService.updateSupplier(param.id, updateSupplierDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '[ ADMIN ] delete supplier by id' })
  async deleteSupplier(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.supplierService.deleteSupplier(param.id, userId);
  }
}
