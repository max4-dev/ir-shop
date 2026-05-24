import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsRequestDto } from './dto/get-all-products.dto';
import { SlugParamDto } from './dto/slug-param.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponse } from './product.mapper';
import { ProductService } from './product.service';
import { PaginatedProducts, ProductsByCategory } from './product.types';

@ApiTags('Продукты')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({ status: 200, description: 'Постраничный список продуктов' })
  @Get()
  getAll(@Query() query: GetAllProductsRequestDto): Promise<PaginatedProducts> {
    return this.productService.getAll(query);
  }

  @ApiOperation({ summary: 'Получить продукты по категории' })
  @ApiParam({ name: 'slug', example: 'product-1' })
  @ApiResponse({ status: 200, description: 'Категория и список продуктов' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get('category/:slug')
  getByCategory(
    @Param() { slug }: SlugParamDto,
    @Query() query: GetAllProductsRequestDto,
  ): Promise<ProductsByCategory> {
    return this.productService.getByCategory(slug, query);
  }

  @ApiOperation({ summary: 'Получить продукт по slug' })
  @ApiParam({ name: 'slug', example: 'product-1' })
  @ApiResponse({ status: 200, description: 'Продукт' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get('slug/:slug')
  getBySlug(@Param() { slug }: SlugParamDto): Promise<ProductResponse> {
    return this.productService.getBySlug(slug);
  }

  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Продукт' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponse> {
    return this.productService.getById(id);
  }

  @ApiOperation({ summary: 'Создать продукт' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Продукт создан' })
  @ApiResponse({ status: 400, description: 'Категории не найдены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductResponse> {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: 'Обновить продукт' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Продукт обновлён' })
  @ApiResponse({ status: 400, description: 'Категории не найдены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Auth(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Продукт удалён' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Auth(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ id: string }> {
    return this.productService.delete(id);
  }
}
