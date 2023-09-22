import { ArrayMinSize, IsArray, IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types, Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { OrderPaymentMethod, OrderType } from 'src/shares/enums/order.enum';

export class TimestampDto {
  @ApiProperty({ required: false })
  start_time: number;
  @ApiProperty({ required: false })
  end_time: number;
}

export class DateDto {
  @ApiProperty({ required: false })
  start_date?: number;

  @ApiProperty({ required: false })
  end_date?: number;
}

export class PhoneTime {
  @ApiProperty({ required: false, type: Schema.Types.Date })
  end_time: Schema.Types.Date;

  @ApiProperty({ required: false, type: Schema.Types.Date })
  start_time: Schema.Types.Date;
}

export class CreateOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  products: Types.ObjectId[];

  @ApiProperty({ required: false })
  @IsArray()
  @ArrayMinSize(0)
  @IsOptional()
  promotions: Types.ObjectId[];

  @ApiProperty({ required: false, enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  link_pancake?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  name_pancake?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  payment_method_id: OrderPaymentMethod;

  @ApiProperty({
    required: false,
    type: TimestampDto,
  })
  @IsOptional()
  delivery_time: TimestampDto;

  @ApiProperty({
    required: false,
    type: DateDto,
  })
  @IsOptional()
  delivery_date: DateDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  shipping_id: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  describe: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  zip_code: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false, type: Schema.Types.Date })
  @IsOptional()
  @IsDate()
  shipping_at?: Schema.Types.Date;

  @ApiProperty({ required: false, type: Schema.Types.Date })
  @IsOptional()
  @IsDate()
  receive_at?: Schema.Types.Date;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  user_note?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  shipping_note?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({ required: false, type: PhoneTime })
  @IsOptional()
  phone_time?: PhoneTime;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  deposit: number;
}
