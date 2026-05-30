import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock: jest.Mocked<AuthService> = {
    register: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerification: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    login: jest.fn(),
    validatePassword: jest.fn(),
    getNewTokens: jest.fn(),
    adminLogin: jest.fn(),
    getAdminNewTokens: jest.fn(),
    logout: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authServiceMock);
  });

  it('register проксирует вызов в service', async () => {
    authServiceMock.register.mockResolvedValue({ message: 'ok' });
    const dto = { email: 'a@a.com', name: 'User', password: '123456' };

    const result = await controller.register(dto);

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'ok' });
  });

  it('verifyEmail проксирует вызов в service', async () => {
    authServiceMock.verifyEmail.mockResolvedValue({ message: 'ok' });
    const dto = { token: 'token' };

    const result = await controller.verifyEmail(dto);

    expect(authServiceMock.verifyEmail).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'ok' });
  });

  it('login проксирует dto, req, res в service', async () => {
    const dto = { email: 'a@a.com', password: '123456' };
    const req = {};
    const res = {};
    authServiceMock.login.mockResolvedValue({ accessToken: 'token' });

    const result = await controller.login(dto, req as any, res as any);

    expect(authServiceMock.login).toHaveBeenCalledWith(dto, req, res);
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('getNewTokens проксирует req и res в service', async () => {
    const req = {};
    const res = {};
    authServiceMock.getNewTokens.mockResolvedValue({ accessToken: 'token' });

    const result = await controller.getNewTokens(req as any, res as any);

    expect(authServiceMock.getNewTokens).toHaveBeenCalledWith(req, res);
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('adminLogin проксирует вызов в service', async () => {
    const dto = { email: 'admin@a.com', password: '123456' };
    const req = {};
    const res = {};
    authServiceMock.adminLogin.mockResolvedValue({ accessToken: 'token' });

    const result = await controller.adminLogin(dto, req as any, res as any);

    expect(authServiceMock.adminLogin).toHaveBeenCalledWith(dto, req, res);
    expect(result).toEqual({ accessToken: 'token' });
  });

  it('logout проксирует userId и res в service', async () => {
    const res = {};
    authServiceMock.logout.mockResolvedValue({ message: 'Успешный выход' });

    const result = await controller.logout('user-1', res as any);

    expect(authServiceMock.logout).toHaveBeenCalledWith('user-1', res);
    expect(result).toEqual({ message: 'Успешный выход' });
  });
});
