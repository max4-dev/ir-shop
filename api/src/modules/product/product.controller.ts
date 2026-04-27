import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@ApiTags('Продукты')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: 200, description: 'Список продуктов' })
  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @ApiOperation({ summary: 'Получить продукты по категории' })
  @ApiParam({ name: 'slug', example: 'product-1' })
  @ApiResponse({ status: 200, description: 'Категория и список продуктов' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get('category/:slug')
  async getByCategory(@Param('slug') slug: string) {
    return this.productService.getByCategory(slug);
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Продукт' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Создать продукт' })
  @ApiResponse({ status: 201, description: 'Продукт создан' })
  @ApiResponse({ status: 400, description: 'Категории не найдены' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: 'Обновить продукт' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Продукт обновлён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductDto) {
    return this.productService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Продукт удалён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
