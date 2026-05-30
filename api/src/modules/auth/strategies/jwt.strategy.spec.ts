import { describe, expect, it } from '@jest/globals';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('validate возвращает id, role и tokenVersion из payload', async () => {
    const configServiceMock = {
      getOrThrow: () => 'secret',
    };
    const strategy = new JwtStrategy(configServiceMock as any);

    const result = await strategy.validate({
      id: 'user-1',
      role: 'USER' as any,
      tokenVersion: 2,
    });

    expect(result).toEqual({
      id: 'user-1',
      role: 'USER',
      tokenVersion: 2,
    });
  });
});
