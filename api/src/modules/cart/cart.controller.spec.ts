import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;

  const cartServiceMock: jest.Mocked<
    Pick<
      CartService,
      'getCart' | 'addItem' | 'setItemQuantity' | 'removeItem' | 'clear'
    >
  > = {
    getCart: jest.fn(),
    addItem: jest.fn(),
    setItemQuantity: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CartController(cartServiceMock as unknown as CartService);
  });

  it('getCart вызывает service.getCart с sessionId', async () => {
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    cartServiceMock.getCart.mockImplementation(async () => response as any);

    const result = await controller.getCart('sess-1');

    expect(cartServiceMock.getCart).toHaveBeenCalledWith('sess-1');
    expect(result).toEqual(response);
  });

  it('addItem вызывает service.addItem с sessionId, productId и quantity', async () => {
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    cartServiceMock.addItem.mockImplementation(async () => response as any);

    const result = await controller.addItem('sess-1', {
      productId: 'prod-1',
      quantity: 2,
    });

    expect(cartServiceMock.addItem).toHaveBeenCalledWith('sess-1', 'prod-1', 2);
    expect(result).toEqual(response);
  });

  it('updateItem вызывает service.setItemQuantity с sessionId, productId и quantity', async () => {
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    cartServiceMock.setItemQuantity.mockImplementation(
      async () => response as any,
    );

    const result = await controller.updateItem(
      'sess-1',
      { productId: 'prod-1' },
      { quantity: 5 },
    );

    expect(cartServiceMock.setItemQuantity).toHaveBeenCalledWith(
      'sess-1',
      'prod-1',
      5,
    );
    expect(result).toEqual(response);
  });

  it('removeItem вызывает service.removeItem с sessionId и productId', async () => {
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    cartServiceMock.removeItem.mockImplementation(async () => response as any);

    const result = await controller.removeItem('sess-1', { productId: 'prod-1' });

    expect(cartServiceMock.removeItem).toHaveBeenCalledWith('sess-1', 'prod-1');
    expect(result).toEqual(response);
  });

  it('clear вызывает service.clear с sessionId', async () => {
    const response = { id: 'cart-1', sessionId: 'sess-1', items: [] };
    cartServiceMock.clear.mockImplementation(async () => response as any);

    const result = await controller.clear('sess-1');

    expect(cartServiceMock.clear).toHaveBeenCalledWith('sess-1');
    expect(result).toEqual(response);
  });
});
