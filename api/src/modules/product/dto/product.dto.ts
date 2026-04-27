import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'Название товара' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 10000 })
  @Min(0)
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 'Описание товара' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  @IsString()
  image: string;

  @ApiProperty({
    example: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
  })
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ example: 50 })
  @Min(0)
  @IsNumber()
  availableCount: number;

  @ApiProperty({ example: 10, description: 'Процент скидки от 0 до 100' })
  @Min(0)
  @Max(100)
  @IsNumber()
  salePercent: number;

  @ApiPropertyOptional({ example: [1, 2], description: 'ID категорий' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];
}
