import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { PRODUCT_LIMITS } from '../constants/product.constants';

export class CreateProductDto {
  @ApiProperty({ example: 'Название товара' })
  @IsString()
  @MaxLength(PRODUCT_LIMITS.MAX_NAME_LENGTH)
  name: string;

  @ApiProperty({ example: 10000 })
  @IsInt()
  @Min(0)
  @Max(PRODUCT_LIMITS.MAX_PRICE)
  price: number;

  @ApiPropertyOptional({ example: 'Описание товара', nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  image: string;

  @ApiProperty({
    example: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  })
  @IsArray()
  @ArrayMaxSize(PRODUCT_LIMITS.MAX_IMAGES)
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  @Max(PRODUCT_LIMITS.MAX_AVAILABLE_COUNT)
  availableCount: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Процент скидки от 0 до 100',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(PRODUCT_LIMITS.MAX_SALE_PERCENT)
  salePercent?: number;

  @ApiProperty({
    example: ['e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01'],
    description: 'UUID категорий',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(PRODUCT_LIMITS.MAX_CATEGORIES)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
