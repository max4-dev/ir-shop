import { describe, expect, it, jest } from '@jest/globals';
import { SessionMiddleware } from './session.middleware';

describe('SessionMiddleware', () => {
  it('проставляет sessionId в request и вызывает next', async () => {
    const sessionServiceMock = {
      ensureSession: jest.fn(async () => ({ id: 'sess-1' })),
    };
    const middleware = new SessionMiddleware(sessionServiceMock as any);
    const req: Record<string, unknown> = {};
    const res = {};
    const next = jest.fn();

    await middleware.use(req as any, res as any, next);

    expect(sessionServiceMock.ensureSession).toHaveBeenCalledWith(req, res);
    expect(req.sessionId).toBe('sess-1');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
