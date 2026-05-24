import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { CART_QUANTITY } from '../cart.constants';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 2,
    minimum: CART_QUANTITY.MIN,
    maximum: CART_QUANTITY.MAX,
  })
  @IsInt()
  @Min(CART_QUANTITY.MIN)
  @Max(CART_QUANTITY.MAX)
  quantity: number;
}
