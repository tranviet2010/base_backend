import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export class BuyingInfoDto {
  @ApiProperty({ required: true })
  @IsNumber()
  deposit: number;

  @ApiProperty({ required: true })
  @IsNumber()
  total: number;
}

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly ID?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly desc: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly product_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly service_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly imei?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly iccid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly contract_expire_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly active_date?: Date;

  @ApiProperty({ required: true })
  @IsDate()
  readonly import_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly inactive_date?: Date;

  @ApiProperty({ required: true })
  @IsDate()
  buying_info?: BuyingInfoDto;

  @ApiProperty({
    required: false,
    enum: ProductStatusEnum,
  })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;

  @ApiProperty({ required: true })
  @IsNumber()
  saihakko_fee: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  producer_id: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  unit_id: string;

  @ApiProperty({ required: true })
  @IsNumber()
  buying_price: number;
}
