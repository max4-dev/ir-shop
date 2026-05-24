import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { CategoryService } from './category.service';
import { CategoryIdParamDto } from './dto/category-id-param.dto';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Категории')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Получить все категории' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Категория' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get(':id')
  getById(@Param() { id }: CategoryIdParamDto) {
    return this.categoryService.getById(id);
  }

  @ApiOperation({ summary: 'Создать категорию' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Категория создана' })
  @Auth(Role.ADMIN)
  @Post()
  create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Auth(Role.ADMIN)
  @Put(':id')
  update(@Param() { id }: CategoryIdParamDto, @Body() dto: CategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01' })
  @ApiResponse({ status: 200, description: 'Категория удалена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Auth(Role.ADMIN)
  @Delete(':id')
  delete(@Param() { id }: CategoryIdParamDto) {
    return this.categoryService.delete(id);
  }
}
