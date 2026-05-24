import { Prisma } from '@prisma/client';
import { ProductSort } from './constants/product-sort.enum';
import { GetAllProductsRequestDto } from './dto/get-all-products.dto';

export const buildProductWhere = (
  query: GetAllProductsRequestDto,
): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.priceWithSale = {
      ...(query.minPrice !== undefined && { gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
    };
  }

  if (query.onSale === true) {
    where.salePercent = { gt: 0 };
  } else if (query.onSale === false) {
    where.salePercent = { equals: 0 };
  }

  const search = query.search?.trim();
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
};

export const buildProductOrderBy = (
  sort?: ProductSort,
): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case ProductSort.PriceAsc:
      return { priceWithSale: 'asc' };
    case ProductSort.PriceDesc:
      return { priceWithSale: 'desc' };
    case ProductSort.Popularity:
      return { cartItems: { _count: 'desc' } };
    case ProductSort.Newest:
    default:
      return { id: 'desc' };
  }
};
