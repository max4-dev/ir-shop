import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';
import { CART_QUANTITY } from '../cart.constants';

export class AddCartItemDto {
  @ApiProperty({ example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @IsUUID('4')
  productId: string;

  @ApiProperty({
    example: 1,
    minimum: CART_QUANTITY.MIN,
    maximum: CART_QUANTITY.MAX,
  })
  @IsInt()
  @Min(CART_QUANTITY.MIN)
  @Max(CART_QUANTITY.MAX)
  quantity: number;
}
