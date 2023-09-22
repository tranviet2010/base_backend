import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePromotionDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  percent_discount?: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  gift?: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsString()
  start_date?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @IsString()
  expiration_date?: Date;
}
