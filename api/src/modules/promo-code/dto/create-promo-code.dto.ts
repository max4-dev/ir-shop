import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { PROMO_CODE } from '../promo-code.constants';

export class CreatePromoCodeDto {
  @ApiProperty({ example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @IsUUID('4')
  userId: string;

  @ApiPropertyOptional({
    example: PROMO_CODE.DEFAULT_DISCOUNT_PERCENT,
    minimum: PROMO_CODE.MIN_DISCOUNT_PERCENT,
    maximum: PROMO_CODE.MAX_DISCOUNT_PERCENT,
    default: PROMO_CODE.DEFAULT_DISCOUNT_PERCENT,
  })
  @IsOptional()
  @IsInt()
  @Min(PROMO_CODE.MIN_DISCOUNT_PERCENT)
  @Max(PROMO_CODE.MAX_DISCOUNT_PERCENT)
  discountPercent?: number;
}
