import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @Min(0)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsUrl()
  @IsString({ each: true })
  images: string[];

  // @IsString({ each: true })
  // @ArrayMinSize(1)
  // categories: string;

  @IsBoolean()
  isAvailable: boolean;

  @Min(0)
  @IsNumber()
  availableCount: number;

  @Min(0)
  @Max(100)
  @IsNumber()
  salePercent: number;
}
