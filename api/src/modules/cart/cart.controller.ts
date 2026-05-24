import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionId } from '../session/decorators/session-id.decorator';
import { CartResponse } from './cart.mapper';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { ProductIdParamDto } from './dto/product-id-param.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Корзина')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Получить корзину текущей сессии' })
  @ApiResponse({ status: 200, description: 'Корзина' })
  @Get()
  getCart(@SessionId() sessionId: string): Promise<CartResponse> {
    return this.cartService.getCart(sessionId);
  }

  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 201, description: 'Обновлённая корзина' })
  @ApiResponse({
    status: 400,
    description: 'Товар недоступен или недостаточно остатка',
  })
  @Post('items')
  addItem(
    @SessionId() sessionId: string,
    @Body() dto: AddCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.addItem(sessionId, dto.productId, dto.quantity);
  }

  @ApiOperation({ summary: 'Изменить количество позиции' })
  @ApiParam({
    name: 'productId',
    example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01',
  })
  @ApiResponse({ status: 200, description: 'Обновлённая корзина' })
  @ApiResponse({ status: 404, description: 'Позиция в корзине не найдена' })
  @ApiResponse({
    status: 400,
    description: 'Товар недоступен или недостаточно остатка',
  })
  @Patch('items/:productId')
  updateItem(
    @SessionId() sessionId: string,
    @Param() { productId }: ProductIdParamDto,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.setItemQuantity(sessionId, productId, dto.quantity);
  }

  @ApiOperation({ summary: 'Удалить позицию из корзины' })
  @ApiParam({
    name: 'productId',
    example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01',
  })
  @ApiResponse({ status: 200, description: 'Обновлённая корзина' })
  @ApiResponse({ status: 404, description: 'Позиция в корзине не найдена' })
  @Delete('items/:productId')
  removeItem(
    @SessionId() sessionId: string,
    @Param() { productId }: ProductIdParamDto,
  ): Promise<CartResponse> {
    return this.cartService.removeItem(sessionId, productId);
  }

  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({ status: 200, description: 'Пустая корзина' })
  @Delete()
  clear(@SessionId() sessionId: string): Promise<CartResponse> {
    return this.cartService.clear(sessionId);
  }
}
