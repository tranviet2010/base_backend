import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class CreateSupplierDto {
  @ApiProperty({
    required: true,
    example: 'Sim-HaNoi',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: 'SB',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
    example: 'Cầu Giấy - Hà Nội',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    required: true,
    example: '09999988888',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    required: true,
  })
  
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  policy: string;
}
