import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  @Trim()
  user_id?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  client_id?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  order_id?: string;
}

export class GetClientOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  order_id?: string;
}
