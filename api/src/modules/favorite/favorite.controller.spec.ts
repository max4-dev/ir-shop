import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

describe('FavoriteController', () => {
  let controller: FavoriteController;

  const favoriteServiceMock: jest.Mocked<
    Pick<FavoriteService, 'getFavorites' | 'addItem' | 'removeItem' | 'clear'>
  > = {
    getFavorites: jest.fn(),
    addItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new FavoriteController(
      favoriteServiceMock as unknown as FavoriteService,
    );
  });

  it('getFavorites вызывает service.getFavorites', async () => {
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    favoriteServiceMock.getFavorites.mockResolvedValue(response as any);

    const result = await controller.getFavorites('sess-1');

    expect(favoriteServiceMock.getFavorites).toHaveBeenCalledWith('sess-1');
    expect(result).toEqual(response);
  });

  it('addItem вызывает service.addItem с sessionId и productId', async () => {
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 1 };
    favoriteServiceMock.addItem.mockResolvedValue(response as any);

    const result = await controller.addItem('sess-1', { productId: 'prod-1' });

    expect(favoriteServiceMock.addItem).toHaveBeenCalledWith('sess-1', 'prod-1');
    expect(result).toEqual(response);
  });

  it('removeItem вызывает service.removeItem с sessionId и productId', async () => {
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    favoriteServiceMock.removeItem.mockResolvedValue(response as any);

    const result = await controller.removeItem('sess-1', { productId: 'prod-1' });

    expect(favoriteServiceMock.removeItem).toHaveBeenCalledWith('sess-1', 'prod-1');
    expect(result).toEqual(response);
  });

  it('clear вызывает service.clear', async () => {
    const response = { id: 'fav-1', sessionId: 'sess-1', items: [], totalCount: 0 };
    favoriteServiceMock.clear.mockResolvedValue(response as any);

    const result = await controller.clear('sess-1');

    expect(favoriteServiceMock.clear).toHaveBeenCalledWith('sess-1');
    expect(result).toEqual(response);
  });
});
