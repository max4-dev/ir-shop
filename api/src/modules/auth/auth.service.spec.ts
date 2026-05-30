import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';

const hashMock = jest.fn();
const verifyMock = jest.fn();
const uuidMock = jest.fn();

jest.mock('argon2', () => ({
  hash: (...args: unknown[]) => hashMock(...args),
  verify: (...args: unknown[]) => verifyMock(...args),
}));

jest.mock('uuid', () => ({
  v4: () => uuidMock(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const jwtMock = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const tokenServiceMock = {
    saveRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    removeAllUserTokens: jest.fn(),
  };

  const cookieServiceMock = {
    setAuthCookies: jest.fn(),
    getRefreshToken: jest.fn(),
    clearAuthCookie: jest.fn(),
  };

  const sessionServiceMock = {
    findActiveByUserId: jest.fn(),
    attachToUser: jest.fn(),
    setSessionCookie: jest.fn(),
  };

  const cartServiceMock = {
    mergeAnonymousCart: jest.fn(),
  };

  const favoriteServiceMock = {
    mergeAnonymousFavorites: jest.fn(),
  };

  const mailServiceMock = {
    sendVerifyEmail: jest.fn(),
    sendResetPasswordEmail: jest.fn(),
    sendPasswordChangedEmail: jest.fn(),
  };

  const emailTokenServiceMock = {
    create: jest.fn(),
    consume: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      jwtMock as any,
      prismaMock as any,
      tokenServiceMock as any,
      cookieServiceMock as any,
      sessionServiceMock as any,
      cartServiceMock as any,
      favoriteServiceMock as any,
      mailServiceMock as any,
      emailTokenServiceMock as any,
    );
  });

  it('register кидает ошибку, если email уже занят', async () => {
    prismaMock.user.findUnique.mockImplementation(async () => ({ id: 'u1' }));

    await expect(
      service.register({
        email: 'test@mail.com',
        name: 'User',
        password: '123456',
      }),
    ).rejects.toThrow(
      new BadRequestException('Пользователь с таким email уже существует'),
    );
  });

  it('register создает пользователя и отправляет письмо верификации', async () => {
    prismaMock.user.findUnique.mockImplementation(async () => null);
    uuidMock.mockReturnValue('user-1');
    hashMock.mockImplementation(async () => 'hashed-pass');
    prismaMock.user.create.mockImplementation(async () => ({
      id: 'user-1',
      email: 'test@mail.com',
      name: 'User',
      role: Role.USER,
      pendingEmail: null,
      emailVerifiedAt: null,
    }));
    emailTokenServiceMock.create.mockImplementation(async () => 'verify-token');

    const result = await service.register({
      email: 'test@mail.com',
      name: 'User',
      password: '123456',
    });

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        id: 'user-1',
        email: 'test@mail.com',
        name: 'User',
        role: Role.USER,
        password: 'hashed-pass',
        emailVerifiedAt: null,
      },
    });
    expect(mailServiceMock.sendVerifyEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@mail.com',
        token: 'verify-token',
        isEmailChange: false,
      }),
    );
    expect(result).toEqual({
      message: 'Письмо с подтверждением отправлено на ваш email',
    });
  });

  it('login возвращает access token и ставит cookies', async () => {
    const req = { sessionId: 'sess-1' };
    const res = {};
    prismaMock.user.findUnique.mockImplementation(async () => ({
      id: 'user-1',
      email: 'test@mail.com',
      name: 'User',
      password: 'hashed',
      role: Role.USER,
      tokenVersion: 1,
      emailVerifiedAt: new Date(),
    }));
    verifyMock.mockImplementation(async () => true);
    jwtMock.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    tokenServiceMock.saveRefreshToken.mockImplementation(async () => undefined);
    cartServiceMock.mergeAnonymousCart.mockImplementation(async () => undefined);
    favoriteServiceMock.mergeAnonymousFavorites.mockImplementation(
      async () => undefined,
    );

    const result = await service.login(
      { email: 'test@mail.com', password: '123456' },
      req as any,
      res as any,
    );

    expect(tokenServiceMock.saveRefreshToken).toHaveBeenCalledWith({
      userId: 'user-1',
      refreshToken: 'refresh-token',
      role: Role.USER,
    });
    expect(cookieServiceMock.setAuthCookies).toHaveBeenCalledWith(res, {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'user-1',
    });
    expect(cartServiceMock.mergeAnonymousCart).toHaveBeenCalledWith(
      'sess-1',
      'user-1',
      res,
    );
    expect(favoriteServiceMock.mergeAnonymousFavorites).toHaveBeenCalledWith(
      'sess-1',
      'user-1',
      res,
    );
    expect(result).toEqual({ accessToken: 'access-token' });
  });

  it('login кидает ForbiddenException если email не подтвержден', async () => {
    prismaMock.user.findUnique.mockImplementation(async () => ({
      id: 'user-1',
      email: 'test@mail.com',
      password: 'hashed',
      role: Role.USER,
      tokenVersion: 1,
      emailVerifiedAt: null,
    }));
    verifyMock.mockImplementation(async () => true);

    await expect(
      service.login(
        { email: 'test@mail.com', password: '123456' },
        {} as any,
        {} as any,
      ),
    ).rejects.toThrow(
      new ForbiddenException(
        'Подтвердите email. Проверьте почту или запросите письмо повторно',
      ),
    );
  });

  it('verifyEmail кидает ошибку при недействительном токене', async () => {
    emailTokenServiceMock.consume.mockImplementation(async () => null);

    await expect(service.verifyEmail({ token: 'bad-token' })).rejects.toThrow(
      new BadRequestException('Ссылка недействительна или устарела'),
    );
  });

  it('getNewTokens кидает UnauthorizedException без refresh token', async () => {
    cookieServiceMock.getRefreshToken.mockReturnValue(undefined);

    await expect(service.getNewTokens({} as any, {} as any)).rejects.toThrow(
      new UnauthorizedException('Refresh токен не предоставлен'),
    );
  });

  it('logout удаляет refresh token и очищает cookies', async () => {
    tokenServiceMock.removeRefreshToken.mockImplementation(async () => undefined);

    const result = await service.logout('user-1', {} as any);

    expect(tokenServiceMock.removeRefreshToken).toHaveBeenCalledWith('user-1');
    expect(cookieServiceMock.clearAuthCookie).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Успешный выход' });
  });
});
