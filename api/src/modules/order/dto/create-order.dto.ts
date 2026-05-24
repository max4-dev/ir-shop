import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ORDER_CUSTOMER, ORDER_PHONE_REGEX } from '../order.constants';

export class CreateOrderDto {
  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @MinLength(ORDER_CUSTOMER.NAME_MIN_LENGTH)
  @MaxLength(ORDER_CUSTOMER.NAME_MAX_LENGTH)
  customerName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(ORDER_CUSTOMER.EMAIL_MAX_LENGTH)
  customerEmail: string;

  @ApiProperty({ example: '+7 999 123-45-67' })
  @IsString()
  @Matches(ORDER_PHONE_REGEX, { message: 'Некорректный формат телефона' })
  customerPhone: string;

  @ApiProperty({ example: 'г. Москва, ул. Пушкина, д. Колотушкина, кв. 1' })
  @IsString()
  @MinLength(ORDER_CUSTOMER.ADDRESS_MIN_LENGTH)
  @MaxLength(ORDER_CUSTOMER.ADDRESS_MAX_LENGTH)
  deliveryAddress: string;

  @ApiPropertyOptional({
    example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01',
    description: 'UUID промокода (только для авторизованного пользователя)',
  })
  @IsOptional()
  @IsUUID('4')
  promoCode?: string;
}
