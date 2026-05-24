import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/common/database/prisma.service';
import { generateSlug, isPrismaRecordNotFound } from 'src/common/utils';
import { PRODUCT_DEFAULTS } from './constants/product.constants';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsRequestDto } from './dto/get-all-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { calcPriceWithSale } from './helpers/product.helpers';
import {
  formatProduct,
  productInclude,
  ProductResponse,
} from './product.mapper';
import {
  buildProductOrderBy,
  buildProductWhere,
} from './product.query-builder';
import { PaginatedProducts, ProductsByCategory } from './product.types';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: GetAllProductsRequestDto): Promise<PaginatedProducts> {
    const where = buildProductWhere(query);
    const orderBy = buildProductOrderBy(query.sort);

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: query.offset,
        take: query.limit,
        include: productInclude,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map(formatProduct),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async getById(id: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }
    return formatProduct(product);
  }

  async getBySlug(slug: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }
    return formatProduct(product);
  }

  async getByCategory(
    slug: string,
    query: GetAllProductsRequestDto,
  ): Promise<ProductsByCategory> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const where = {
      ...buildProductWhere(query),
      categories: { some: { categoryId: category.id } },
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: buildProductOrderBy(query.sort),
        skip: query.offset,
        take: query.limit,
        include: productInclude,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      category,
      products: products.map(formatProduct),
      total,
      limit: query.limit,
      offset: query.offset,
    };
  }

  async create(dto: CreateProductDto): Promise<ProductResponse> {
    await this.assertCategoriesExist(dto.categoryIds);

    const id = randomUUID();
    const salePercent = dto.salePercent ?? PRODUCT_DEFAULTS.SALE_PERCENT;

    const product = await this.prisma.product.create({
      data: {
        id,
        slug: generateSlug(`${dto.name}-${id}`),
        name: dto.name,
        image: dto.image,
        images: dto.images,
        price: dto.price,
        salePercent,
        priceWithSale: calcPriceWithSale(dto.price, salePercent),
        isAvailable: dto.isAvailable,
        availableCount: dto.availableCount,
        description: dto.description,
        categories: {
          create: dto.categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: productInclude,
    });

    return formatProduct(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    if (dto.categoryIds?.length) {
      await this.assertCategoriesExist(dto.categoryIds);
    }

    const priceWithSale = await this.resolvePriceWithSale(id, dto);

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
          ...(dto.categoryIds?.length && {
            categories: {
              deleteMany: {},
              create: dto.categoryIds.map((categoryId) => ({ categoryId })),
            },
          }),
        },
        include: productInclude,
      });
      return formatProduct(product);
    } catch (error) {
      if (isPrismaRecordNotFound(error)) {
        throw new NotFoundException('Продукт не найден');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<{ id: string }> {
    try {
      return await this.prisma.product.delete({
        where: { id },
        select: { id: true },
      });
    } catch (error) {
      if (isPrismaRecordNotFound(error)) {
        throw new NotFoundException('Продукт не найден');
      }
      throw error;
    }
  }

  private async resolvePriceWithSale(
    id: string,
    dto: UpdateProductDto,
  ): Promise<number | undefined> {
    const shouldRecalc =
      dto.price !== undefined || dto.salePercent !== undefined;
    if (!shouldRecalc) {
      return undefined;
    }

    const current = await this.prisma.product.findUnique({
      where: { id },
      select: { price: true, salePercent: true },
    });
    if (!current) {
      return undefined;
    }

    return calcPriceWithSale(
      dto.price ?? current.price,
      dto.salePercent ?? current.salePercent,
    );
  }

  private async assertCategoriesExist(ids: string[]): Promise<void> {
    const found = await this.prisma.category.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (found.length === ids.length) {
      return;
    }
    const foundSet = new Set(found.map((c) => c.id));
    const missing = ids.filter((id) => !foundSet.has(id));
    throw new BadRequestException(
      `Категории не найдены: ${missing.join(', ')}`,
    );
  }
}
