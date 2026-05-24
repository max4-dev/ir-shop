import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ProductIdParamDto {
  @ApiProperty({ example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @IsUUID('4')
  productId: string;
}
