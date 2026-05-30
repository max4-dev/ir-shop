import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

const formatFavoriteMock = jest.fn();
const isPrismaRecordNotFoundMock = jest.fn();

jest.mock('./favorite.mapper', () => ({
  favoriteInclude: { items: { include: {} } },
  formatFavorite: (...args: unknown[]) => formatFavoriteMock(...args),
}));

jest.mock('src/common/utils', () => ({
  isPrismaRecordNotFound: (...args: unknown[]) =>
    isPrismaRecordNotFoundMock(...args),
}));

describe('FavoriteService', () => {
  let service: FavoriteService;

  const txMock = {
    product: { findUnique: jest.fn() },
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    favoriteItem: {
      upsert: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    order: { count: jest.fn() },
    session: { delete: jest.fn() },
  };

  const prismaMock = {
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const sessionServiceMock = {
    findActiveByUserId: jest.fn(),
    attachToUser: jest.fn(),
    setSessionCookie: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.$transaction.mockImplementation(async (cb: any) => cb(txMock));
    service = new FavoriteService(
      prismaMock as any,
      sessionServiceMock as any,
    );
  });

  it('getFavorites возвращает существующее избранное', async () => {
    const favorite = { id: 'fav-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    prismaMock.favorite.findUnique.mockImplementation(async () => favorite);
    formatFavoriteMock.mockReturnValue(response);

    const result = await service.getFavorites('sess-1');

    expect(prismaMock.favorite.findUnique).toHaveBeenCalledWith({
      where: { sessionId: 'sess-1' },
      include: { items: { include: {} } },
    });
    expect(formatFavoriteMock).toHaveBeenCalledWith(favorite);
    expect(result).toEqual(response);
  });

  it('getFavorites создает избранное если нет записи', async () => {
    const created = { id: 'fav-new', sessionId: 'sess-new', items: [] };
    const response = {
      id: 'fav-new',
      sessionId: 'sess-new',
      items: [],
      totalCount: 0,
    };
    prismaMock.favorite.findUnique.mockImplementation(async () => null);
    prismaMock.favorite.create.mockImplementation(async () => created);
    formatFavoriteMock.mockReturnValue(response);

    const result = await service.getFavorites('sess-new');

    expect(prismaMock.favorite.create).toHaveBeenCalledWith({
      data: { sessionId: 'sess-new' },
      include: { items: { include: {} } },
    });
    expect(result).toEqual(response);
  });

  it('addItem добавляет товар и возвращает обновленное избранное', async () => {
    const loadedFavorite = { id: 'fav-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    txMock.product.findUnique.mockImplementation(async () => ({ id: 'prod-1' }));
    txMock.favorite.findUnique.mockImplementation(async () => ({ id: 'fav-1' }));
    txMock.favorite.findUniqueOrThrow.mockImplementation(async () => loadedFavorite);
    formatFavoriteMock.mockReturnValue(response);

    const result = await service.addItem('sess-1', 'prod-1');

    expect(txMock.favoriteItem.upsert).toHaveBeenCalledWith({
      where: { favoriteId_productId: { favoriteId: 'fav-1', productId: 'prod-1' } },
      update: {},
      create: { favoriteId: 'fav-1', productId: 'prod-1' },
    });
    expect(txMock.favorite.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'fav-1' },
      include: { items: { include: {} } },
    });
    expect(result).toEqual(response);
  });

  it('removeItem бросает NotFoundException если товара нет в избранном', async () => {
    txMock.favorite.findUnique.mockImplementation(async () => ({ id: 'fav-1' }));
    txMock.favoriteItem.delete.mockImplementation(async () => {
      throw new Error('not found');
    });
    isPrismaRecordNotFoundMock.mockReturnValue(true);

    await expect(service.removeItem('sess-1', 'prod-404')).rejects.toThrow(
      new NotFoundException('Товар prod-404 не найден в избранном'),
    );
  });

  it('clear удаляет все позиции и возвращает пустой список', async () => {
    const loadedFavorite = { id: 'fav-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    txMock.favorite.findUnique.mockImplementation(async () => ({ id: 'fav-1' }));
    txMock.favorite.findUniqueOrThrow.mockImplementation(async () => loadedFavorite);
    txMock.favoriteItem.deleteMany.mockImplementation(async () => ({ count: 3 }));
    formatFavoriteMock.mockReturnValue(response);

    const result = await service.clear('sess-1');

    expect(txMock.favoriteItem.deleteMany).toHaveBeenCalledWith({
      where: { favoriteId: 'fav-1' },
    });
    expect(result).toEqual(response);
  });

  it('mergeAnonymousFavorites привязывает анонимную сессию если у пользователя нет активной', async () => {
    const res = { cookie: jest.fn() };
    sessionServiceMock.findActiveByUserId.mockImplementation(async () => null);
    sessionServiceMock.attachToUser.mockImplementation(async () => null);

    const result = await service.mergeAnonymousFavorites('anon-1', 'user-1', res as any);

    expect(sessionServiceMock.attachToUser).toHaveBeenCalledWith('anon-1', 'user-1');
    expect(sessionServiceMock.setSessionCookie).toHaveBeenCalledWith(res, 'anon-1');
    expect(result).toEqual({ effectiveSessionId: 'anon-1' });
  });

  it('mergeAnonymousFavorites возвращает user session если это та же сессия', async () => {
    const res = { cookie: jest.fn() };
    sessionServiceMock.findActiveByUserId.mockImplementation(async () => ({ id: 'sess-1' }));

    const result = await service.mergeAnonymousFavorites('sess-1', 'user-1', res as any);

    expect(sessionServiceMock.setSessionCookie).toHaveBeenCalledWith(res, 'sess-1');
    expect(result).toEqual({ effectiveSessionId: 'sess-1' });
  });
});
