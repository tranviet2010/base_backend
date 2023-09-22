import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  readonly product_id: string;
}
