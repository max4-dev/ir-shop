import { Prisma } from '@prisma/client';
import {
  formatProduct,
  productInclude,
  ProductResponse,
} from '../product/product.mapper';

export const favoriteItemInclude = {
  product: { include: productInclude },
} satisfies Prisma.FavoriteItemInclude;

export const favoriteInclude = {
  items: {
    include: favoriteItemInclude,
    orderBy: { createdAt: 'asc' },
  },
} satisfies Prisma.FavoriteInclude;

export type FavoriteWithItems = Prisma.FavoriteGetPayload<{
  include: typeof favoriteInclude;
}>;

export interface FavoriteItemResponse {
  productId: string;
  product: ProductResponse;
}

export interface FavoriteResponse {
  id: string;
  sessionId: string;
  items: FavoriteItemResponse[];
  totalCount: number;
}

const formatFavoriteItem = (
  item: FavoriteWithItems['items'][number],
): FavoriteItemResponse => ({
  productId: item.productId,
  product: formatProduct(item.product),
});

export const formatFavorite = (favorite: FavoriteWithItems): FavoriteResponse => {
  const items = favorite.items.map(formatFavoriteItem);

  return {
    id: favorite.id,
    sessionId: favorite.sessionId,
    items,
    totalCount: items.length,
  };
};
