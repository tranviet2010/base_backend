import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ID?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  desc: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  product_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  service_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imei?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  iccid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  contract_expire_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  active_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  inactive_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  import_date?: Date;

  @ApiProperty({
    required: false,
    enum: ProductStatusEnum,
  })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  saihakko_fee: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  producer_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsMongoId()
  @IsString()
  unit_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  buying_price: number;
}
