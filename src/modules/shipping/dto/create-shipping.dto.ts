import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  policy: string;
}
