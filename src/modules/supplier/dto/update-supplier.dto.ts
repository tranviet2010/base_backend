import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class UpdateSupplierDto {
  @ApiProperty({
    required: false,
    example: 'Sim-HaNoi',
  })
  @Trim()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    example: 'SB',
  })
  @Trim()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
    example: 'Cầu Giấy - Hà Nội',
  })
  @IsString()
  address?: string;

  @ApiProperty({
    required: false,
    example: '09999988888',
  })
  @IsString()
  phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  policy?: string;
}
