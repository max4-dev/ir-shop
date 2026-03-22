import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: ProductDto) {
    return this.productService.update(id, dto);
  }

  @Auth(Role.ADMIN)
  @Post()
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
