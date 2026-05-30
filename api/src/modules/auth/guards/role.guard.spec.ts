import { describe, expect, it, jest } from '@jest/globals';
import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };
  const guard = new RoleGuard(reflectorMock as any);

  const createContext = (user?: { role: Role }) =>
    ({
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as any;

  it('разрешает доступ, если роли не заданы', () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);

    const result = guard.canActivate(createContext());

    expect(result).toBe(true);
  });

  it('кидает UnauthorizedException если пользователь отсутствует', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    expect(() => guard.canActivate(createContext())).toThrow(
      new UnauthorizedException('Пользователь не авторизован'),
    );
  });

  it('кидает ForbiddenException если роль не подходит', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    expect(() => guard.canActivate(createContext({ role: Role.USER }))).toThrow(
      new ForbiddenException('Нет доступа'),
    );
  });

  it('разрешает доступ при подходящей роли', () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(createContext({ role: Role.ADMIN }));

    expect(result).toBe(true);
  });
});
