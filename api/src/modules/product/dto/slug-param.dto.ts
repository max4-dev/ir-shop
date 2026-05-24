import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PRODUCT_SLUG } from '../constants/product.constants';

const SLUG_REGEX = /^[a-z0-9-]+$/;

export class SlugParamDto {
  @ApiProperty({ example: 'product-1' })
  @IsString()
  @MinLength(PRODUCT_SLUG.MIN_LENGTH)
  @MaxLength(PRODUCT_SLUG.MAX_LENGTH)
  @Matches(SLUG_REGEX, {
    message: 'Slug может содержать только строчные буквы, цифры и дефисы',
  })
  slug: string;
}
