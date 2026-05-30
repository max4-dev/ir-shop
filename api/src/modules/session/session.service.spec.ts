import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  const sessionRepositoryMock = {
    findById: jest.fn(),
    create: jest.fn(),
    extendTtl: jest.fn(),
    linkUser: jest.fn(),
    findActiveByUserId: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SessionService(sessionRepositoryMock as any);
  });

  it('ensureSession возвращает существующую непросроченную сессию', async () => {
    const expiresAt = new Date(Date.now() + 60_000);
    const session = { id: 'sess-1', expiresAt };
    const req = { cookies: { sessionId: 'sess-1' } };
    const res = { cookie: jest.fn() };
    sessionRepositoryMock.findById.mockImplementation(async () => session);

    const result = await service.ensureSession(req as any, res as any);

    expect(sessionRepositoryMock.findById).toHaveBeenCalledWith('sess-1');
    expect(sessionRepositoryMock.create).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
    expect(result).toEqual(session);
  });

  it('ensureSession создает новую сессию если существующая просрочена', async () => {
    const expired = { id: 'sess-old', expiresAt: new Date(Date.now() - 1_000) };
    const created = {
      id: 'sess-new',
      expiresAt: new Date(Date.now() + 60_000),
    };
    const req = { cookies: { sessionId: 'sess-old' } };
    const res = { cookie: jest.fn() };
    sessionRepositoryMock.findById.mockImplementation(async () => expired);
    sessionRepositoryMock.create.mockImplementation(async () => created);

    const result = await service.ensureSession(req as any, res as any);

    expect(sessionRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'sessionId',
      'sess-new',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }),
    );
    expect(result).toEqual(created);
  });

  it('ensureSession создает новую сессию если cookie отсутствует', async () => {
    const created = {
      id: 'sess-new',
      expiresAt: new Date(Date.now() + 60_000),
    };
    const req = {};
    const res = { cookie: jest.fn() };
    sessionRepositoryMock.create.mockImplementation(async () => created);

    const result = await service.ensureSession(req as any, res as any);

    expect(sessionRepositoryMock.findById).not.toHaveBeenCalled();
    expect(sessionRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'sessionId',
      'sess-new',
      expect.objectContaining({
        maxAge: 7_776_000_000,
      }),
    );
    expect(result).toEqual(created);
  });

  it('extendTtl делегирует обновление TTL в repository', async () => {
    sessionRepositoryMock.extendTtl.mockImplementation(async () => null);

    await service.extendTtl('sess-1');

    expect(sessionRepositoryMock.extendTtl).toHaveBeenCalledWith(
      'sess-1',
      expect.any(Date),
    );
  });

  it('attachToUser делегирует привязку пользователя', async () => {
    const linked = { id: 'sess-1', userId: 'user-1' };
    sessionRepositoryMock.linkUser.mockImplementation(async () => linked);

    const result = await service.attachToUser('sess-1', 'user-1');

    expect(sessionRepositoryMock.linkUser).toHaveBeenCalledWith(
      'sess-1',
      'user-1',
    );
    expect(result).toEqual(linked);
  });

  it('findActiveByUserId делегирует поиск активной сессии', async () => {
    const active = { id: 'sess-1', userId: 'user-1' };
    sessionRepositoryMock.findActiveByUserId.mockImplementation(
      async () => active,
    );

    const result = await service.findActiveByUserId('user-1');

    expect(sessionRepositoryMock.findActiveByUserId).toHaveBeenCalledWith(
      'user-1',
    );
    expect(result).toEqual(active);
  });

  it('deleteById делегирует удаление сессии', async () => {
    sessionRepositoryMock.deleteById.mockImplementation(async () => undefined);

    await service.deleteById('sess-1');

    expect(sessionRepositoryMock.deleteById).toHaveBeenCalledWith('sess-1');
  });

  it('readSessionIdFromCookie возвращает sessionId из cookies', () => {
    const req = { cookies: { sessionId: 'sess-1' } };

    const result = service.readSessionIdFromCookie(req as any);

    expect(result).toBe('sess-1');
  });

  it('clearSessionCookie вызывает clearCookie с корректными опциями', () => {
    const res = { clearCookie: jest.fn() };

    service.clearSessionCookie(res as any);

    expect(res.clearCookie).toHaveBeenCalledWith('sessionId', {
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
  });
});
