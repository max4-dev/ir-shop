import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionId } from '../session/decorators/session-id.decorator';
import { AddFavoriteItemDto } from './dto/add-favorite-item.dto';
import { ProductIdParamDto } from './dto/product-id-param.dto';
import { FavoriteResponse } from './favorite.mapper';
import { FavoriteService } from './favorite.service';

@ApiTags('Избранное')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({ summary: 'Получить избранное текущей сессии' })
  @ApiResponse({ status: 200, description: 'Список избранных товаров' })
  @Get()
  getFavorites(@SessionId() sessionId: string): Promise<FavoriteResponse> {
    return this.favoriteService.getFavorites(sessionId);
  }

  @ApiOperation({ summary: 'Добавить товар в избранное' })
  @ApiResponse({ status: 201, description: 'Обновлённый список избранного' })
  @ApiResponse({ status: 400, description: 'Товар не найден' })
  @Post('items')
  addItem(
    @SessionId() sessionId: string,
    @Body() dto: AddFavoriteItemDto,
  ): Promise<FavoriteResponse> {
    return this.favoriteService.addItem(sessionId, dto.productId);
  }

  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiParam({
    name: 'productId',
    example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01',
  })
  @ApiResponse({ status: 200, description: 'Обновлённый список избранного' })
  @ApiResponse({ status: 404, description: 'Товар не найден в избранном' })
  @Delete('items/:productId')
  removeItem(
    @SessionId() sessionId: string,
    @Param() { productId }: ProductIdParamDto,
  ): Promise<FavoriteResponse> {
    return this.favoriteService.removeItem(sessionId, productId);
  }

  @ApiOperation({ summary: 'Очистить избранное' })
  @ApiResponse({ status: 200, description: 'Пустой список избранного' })
  @Delete()
  clear(@SessionId() sessionId: string): Promise<FavoriteResponse> {
    return this.favoriteService.clear(sessionId);
  }
}
