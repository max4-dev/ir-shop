import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ORDER_PAGINATION } from '../order.constants';

export class GetOrdersRequestDto {
  @ApiPropertyOptional({
    example: ORDER_PAGINATION.DEFAULT_LIMIT,
    default: ORDER_PAGINATION.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(ORDER_PAGINATION.MAX_LIMIT)
  limit: number = ORDER_PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
