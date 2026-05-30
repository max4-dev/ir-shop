import { describe, expect, it } from '@jest/globals';
import { OptionalJwtAuthGuard } from './optional-jwt.guard';

describe('OptionalJwtAuthGuard', () => {
  const guard = new OptionalJwtAuthGuard();

  it('handleRequest возвращает null при ошибке', () => {
    const result = guard.handleRequest(new Error('jwt error'), false);
    expect(result).toBeNull();
  });

  it('handleRequest возвращает null если пользователя нет', () => {
    const result = guard.handleRequest(null, false);
    expect(result).toBeNull();
  });

  it('handleRequest возвращает пользователя при успехе', () => {
    const user = { id: 'u1' };
    const result = guard.handleRequest(null, user);
    expect(result).toEqual(user);
  });
});
