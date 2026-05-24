import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { toBoolean } from 'src/common/utils';
import { ProductSort } from '../constants/product-sort.enum';
import {
  PRODUCT_LIMITS,
  PRODUCT_PAGINATION,
  PRODUCT_SEARCH,
} from '../constants/product.constants';

export class GetAllProductsRequestDto {
  @ApiPropertyOptional({
    example: PRODUCT_PAGINATION.DEFAULT_LIMIT,
    default: PRODUCT_PAGINATION.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PRODUCT_PAGINATION.MAX_LIMIT)
  limit: number = PRODUCT_PAGINATION.DEFAULT_LIMIT;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @ApiPropertyOptional({
    enum: ProductSort,
    description: 'Сортировка: цена/популярность/новизна',
  })
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort;

  @ApiPropertyOptional({
    example: 0,
    description: 'Минимальная цена со скидкой',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(PRODUCT_LIMITS.MAX_PRICE)
  minPrice?: number;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Максимальная цена со скидкой',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(PRODUCT_LIMITS.MAX_PRICE)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Только товары со скидкой',
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  onSale?: boolean;

  @ApiPropertyOptional({
    example: 'крем',
    description: 'Поиск по названию и описанию',
  })
  @IsOptional()
  @IsString()
  @MinLength(PRODUCT_SEARCH.MIN_LENGTH)
  @MaxLength(PRODUCT_SEARCH.MAX_LENGTH)
  search?: string;
}
