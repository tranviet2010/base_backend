import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ProductTypeEnum } from 'src/shares/enums/product.enum';

export class GetProductDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false, enum: ProductTypeEnum })
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  type: ProductTypeEnum;
}
