import {
  BadRequestException,
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
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    if (!product) throw new NotFoundException('Продукт не найден');

    return this.formatProduct(product);
  }

  async getAll() {
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'desc' },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return products.map(this.formatProduct);
  }

  async getByCategory(categorySlug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) throw new NotFoundException('Категория не найдена');

    const products = await this.prisma.product.findMany({
      where: { categories: { some: { categoryId: category.id } } },
      orderBy: { id: 'desc' },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return {
      category,
      items: products.map(this.formatProduct),
    };
  }

  async create(dto: ProductDto) {
    if (dto.categoryIds?.length) {
      await this.assertCategoriesExist(dto.categoryIds);
    }

    const priceWithSale = this.calcPriceWithSale(dto.price, dto.salePercent);

    try {
      const product = await this.prisma.product.create({
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
          categories: dto.categoryIds?.length
            ? { create: dto.categoryIds.map((categoryId) => ({ categoryId })) }
            : undefined,
        },
        include: {
          categories: {
            include: { category: true },
          },
        },
      });

      return this.formatProduct(product);
    } catch {
      throw new InternalServerErrorException('Ошибка при создании продукта');
    }
  }

  async update(id: number, dto: ProductDto) {
    await this.getProductById(id);

    if (dto.categoryIds?.length) {
      await this.assertCategoriesExist(dto.categoryIds);
    }

    const priceWithSale = this.calcPriceWithSale(dto.price, dto.salePercent);

    try {
      const product = await this.prisma.product.update({
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
          categories: {
            deleteMany: {},
            ...(dto.categoryIds?.length && {
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            }),
          },
        },
        include: {
          categories: {
            include: { category: true },
          },
        },
      });

      return this.formatProduct(product);
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении продукта');
    }
  }

  async delete(id: number) {
    await this.getProductById(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Продукт удалён' };
  }

  private formatProduct(product: any) {
    return {
      ...product,
      categories: product.categories.map((cp: any) => cp.category),
    };
  }

  private async assertCategoriesExist(ids: number[]) {
    const found = await this.prisma.category.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    if (found.length !== ids.length) {
      const missing = ids.filter((id) => !found.some((c) => c.id === id));
      throw new BadRequestException(
        `Категории не найдены: ${missing.join(', ')}`,
      );
    }
  }

  private calcPriceWithSale(price: number, salePercent: number) {
    const safePercent = Math.max(0, Math.min(100, salePercent));
    return Math.max(0, Math.ceil(price - price * (safePercent / 100)));
  }
}
