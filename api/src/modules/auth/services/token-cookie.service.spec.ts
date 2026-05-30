import { describe, expect, it, jest } from '@jest/globals';
import { TokenCookieService } from './token-cookie.service';

describe('TokenCookieService', () => {
  const service = new TokenCookieService();

  it('setAuthCookies устанавливает refresh и access cookies', () => {
    const res = { cookie: jest.fn() };

    service.setAuthCookies(res as any, {
      accessToken: 'a-token',
      refreshToken: 'r-token',
      userId: 'user-1',
    });

    expect(res.cookie).toHaveBeenNthCalledWith(
      1,
      'refreshToken',
      'r-token',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(res.cookie).toHaveBeenNthCalledWith(
      2,
      'accessToken',
      'a-token',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });

  it('clearAuthCookie очищает оба cookie', () => {
    const res = { clearCookie: jest.fn() };

    service.clearAuthCookie(res as any);

    expect(res.clearCookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.objectContaining({ path: '/', sameSite: 'lax' }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      'accessToken',
      expect.objectContaining({ path: '/', sameSite: 'lax' }),
    );
  });

  it('getRefreshToken читает refreshToken из cookies', () => {
    const req = { cookies: { refreshToken: 'r-token' } };

    const result = service.getRefreshToken(req as any);

    expect(result).toBe('r-token');
  });
});
