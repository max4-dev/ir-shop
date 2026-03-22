import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return product;
  }

  async getAll() {
    return this.prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async create(dto: ProductDto) {
    const priceWithSale = this.calcPriceWithSale(dto.price, dto.salePercent);

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name,
          image: dto.image,
          images: dto.images,
          price: dto.price,
          salePercent: dto.salePercent,
          priceWithSale,
          isAvailable: dto.isAvailable,
          availableCount: dto.availableCount,
          description: dto.description,
        },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при создании продукта');
    }
  }

  async update(id: number, dto: ProductDto) {
    const priceWithSale = this.calcPriceWithSale(dto.price, dto.salePercent);

    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          name: dto.name,
          image: dto.image,
          images: dto.images,
          price: dto.price,
          salePercent: dto.salePercent,
          priceWithSale,
          isAvailable: dto.isAvailable,
          availableCount: dto.availableCount,
          description: dto.description,
        },
      });
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  delete(id: number) {
    try {
      this.prisma.product.delete({
        where: { id },
      });

      return { message: 'Продукт удалён' };
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  private calcPriceWithSale(price: number, salePercent: number) {
    const safePercent = Math.max(0, Math.min(100, salePercent));
    return Math.max(0, Math.ceil(price - price * (safePercent / 100)));
  }
}
