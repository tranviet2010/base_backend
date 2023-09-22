import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  percent_discount: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  price_discount: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  gift?: string;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsDate()
  start_date?: Date;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @IsDate()
  expiration_date?: Date;
}
