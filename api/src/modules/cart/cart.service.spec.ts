import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';

const formatCartMock = jest.fn();
const isPrismaRecordNotFoundMock = jest.fn();

jest.mock('./cart.mapper', () => ({
  cartInclude: { items: { include: {} } },
  formatCart: (...args: unknown[]) => formatCartMock(...args),
}));

jest.mock('src/common/utils', () => ({
  isPrismaRecordNotFound: (...args: unknown[]) =>
    isPrismaRecordNotFoundMock(...args),
}));

describe('CartService', () => {
  let service: CartService;

  const txMock = {
    product: { findUnique: jest.fn() },
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    order: { count: jest.fn() },
    session: { delete: jest.fn() },
  };

  const prismaMock = {
    cart: {
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
    service = new CartService(prismaMock as any, sessionServiceMock as any);
  });

  it('getCart возвращает существующую корзину', async () => {
    const cart = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    prismaMock.cart.findUnique.mockImplementation(async () => cart);
    formatCartMock.mockReturnValue(response);

    const result = await service.getCart('sess-1');

    expect(prismaMock.cart.findUnique).toHaveBeenCalledWith({
      where: { sessionId: 'sess-1' },
      include: { items: { include: {} } },
    });
    expect(result).toEqual(response);
  });

  it('getCart создает корзину если ее нет', async () => {
    const created = { id: 'cart-new', sessionId: 'sess-new', items: [] };
    const response = { id: 'cart-new', sessionId: 'sess-new', items: [] };
    prismaMock.cart.findUnique.mockImplementation(async () => null);
    prismaMock.cart.create.mockImplementation(async () => created);
    formatCartMock.mockReturnValue(response);

    const result = await service.getCart('sess-new');

    expect(prismaMock.cart.create).toHaveBeenCalledWith({
      data: { sessionId: 'sess-new' },
      include: { items: { include: {} } },
    });
    expect(result).toEqual(response);
  });

  it('addItem делает upsert с суммарным количеством', async () => {
    const loadedCart = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    txMock.product.findUnique.mockImplementation(async () => ({
      id: 'prod-1',
      isAvailable: true,
      availableCount: 10,
    }));
    txMock.cart.findUnique.mockImplementation(async () => ({ id: 'cart-1' }));
    txMock.cartItem.findUnique.mockImplementation(async () => ({ quantity: 2 }));
    txMock.cart.findUniqueOrThrow.mockImplementation(async () => loadedCart);
    formatCartMock.mockReturnValue(response);

    const result = await service.addItem('sess-1', 'prod-1', 3);

    expect(txMock.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 'prod-1' } },
      update: { quantity: 5 },
      create: { cartId: 'cart-1', productId: 'prod-1', quantity: 5 },
    });
    expect(result).toEqual(response);
  });

  it('setItemQuantity обновляет количество существующей позиции', async () => {
    const loadedCart = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    txMock.product.findUnique.mockImplementation(async () => ({
      id: 'prod-1',
      isAvailable: true,
      availableCount: 10,
    }));
    txMock.cart.findUnique.mockImplementation(async () => ({ id: 'cart-1' }));
    txMock.cartItem.findUnique.mockImplementation(async () => ({ quantity: 2 }));
    txMock.cart.findUniqueOrThrow.mockImplementation(async () => loadedCart);
    formatCartMock.mockReturnValue(response);

    const result = await service.setItemQuantity('sess-1', 'prod-1', 4);

    expect(txMock.cartItem.update).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 'prod-1' } },
      data: { quantity: 4 },
    });
    expect(result).toEqual(response);
  });

  it('setItemQuantity кидает 404 если позиции нет в корзине', async () => {
    txMock.product.findUnique.mockImplementation(async () => ({
      id: 'prod-404',
      isAvailable: true,
      availableCount: 10,
    }));
    txMock.cart.findUnique.mockImplementation(async () => ({ id: 'cart-1' }));
    txMock.cartItem.findUnique.mockImplementation(async () => null);

    await expect(
      service.setItemQuantity('sess-1', 'prod-404', 1),
    ).rejects.toThrow(
      new NotFoundException('Позиция корзины с товаром prod-404 не найдена'),
    );
  });

  it('removeItem кидает 404 если позиции нет в корзине', async () => {
    txMock.cart.findUnique.mockImplementation(async () => ({ id: 'cart-1' }));
    txMock.cartItem.delete.mockImplementation(async () => {
      throw new Error('not found');
    });
    isPrismaRecordNotFoundMock.mockReturnValue(true);

    await expect(service.removeItem('sess-1', 'prod-1')).rejects.toThrow(
      new NotFoundException('Позиция корзины с товаром prod-1 не найдена'),
    );
  });

  it('clear удаляет все позиции корзины', async () => {
    const loadedCart = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    txMock.cart.findUnique.mockImplementation(async () => ({ id: 'cart-1' }));
    txMock.cartItem.deleteMany.mockImplementation(async () => ({ count: 2 }));
    txMock.cart.findUniqueOrThrow.mockImplementation(async () => loadedCart);
    formatCartMock.mockReturnValue(response);

    const result = await service.clear('sess-1');

    expect(txMock.cartItem.deleteMany).toHaveBeenCalledWith({
      where: { cartId: 'cart-1' },
    });
    expect(result).toEqual(response);
  });

  it('mergeAnonymousCart привязывает анонимную сессию при отсутствии user session', async () => {
    const res = { cookie: jest.fn() };
    sessionServiceMock.findActiveByUserId.mockImplementation(async () => null);
    sessionServiceMock.attachToUser.mockImplementation(async () => null);

    const result = await service.mergeAnonymousCart('anon-1', 'user-1', res as any);

    expect(sessionServiceMock.attachToUser).toHaveBeenCalledWith('anon-1', 'user-1');
    expect(sessionServiceMock.setSessionCookie).toHaveBeenCalledWith(res, 'anon-1');
    expect(result).toEqual({ effectiveSessionId: 'anon-1' });
  });
});
