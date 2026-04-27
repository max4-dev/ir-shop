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
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Категории')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Категория' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getById(id);
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiResponse({ status: 201, description: 'Категория создана' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Категория удалена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @ApiCookieAuth('access_token')
  @Auth(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
}
