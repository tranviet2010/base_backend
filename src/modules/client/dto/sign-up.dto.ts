import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    required: true,
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    required: true,
    example: 'john wick',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: true,
    example: 'doff',
  })
  @IsNotEmpty()
  readonly display_name: string;
}

export interface SignUpInterface {
  email: string;
  password: string;
  name: string;
  code: string;
}

export interface SignUpCacheInterface extends SignUpInterface {
  attempt: number;
}
