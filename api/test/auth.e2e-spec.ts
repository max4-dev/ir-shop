import { INestApplication } from '@nestjs/common';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';
import request from 'supertest';

jest.mock('../src/modules/auth/decorators/auth.decorator', () => ({
  Auth: () => () => undefined,
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const authServiceMock = {
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
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      (req as Request & { user?: { id: string }; sessionId?: string }).user = {
        id: 'user-1',
      };
      (
        req as Request & {
          user?: { id: string };
          sessionId?: string;
        }
      ).sessionId = 'session-1';
      next();
    });
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register', async () => {
    authServiceMock.register.mockImplementation(async () => ({
      message: 'Письмо с подтверждением отправлено на ваш email',
    }));
    const dto = {
      email: 'new-user@mail.com',
      name: 'New User',
      password: 'Password123!',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201)
      .expect({
        message: 'Письмо с подтверждением отправлено на ваш email',
      });

    expect(authServiceMock.register).toHaveBeenCalledWith(dto);
  });

  it('POST /auth/login', async () => {
    authServiceMock.login.mockImplementation(async () => ({
      accessToken: 'access-token',
    }));
    const dto = { email: 'user@mail.com', password: 'Password123!' };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(201)
      .expect({ accessToken: 'access-token' });

    expect(authServiceMock.login).toHaveBeenCalledWith(
      dto,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('POST /auth/refresh-token', async () => {
    authServiceMock.getNewTokens.mockImplementation(async () => ({
      accessToken: 'new-access-token',
    }));

    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .expect(201)
      .expect({ accessToken: 'new-access-token' });

    expect(authServiceMock.getNewTokens).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('POST /auth/logout', async () => {
    authServiceMock.logout.mockImplementation(async () => ({
      message: 'Успешный выход',
    }));

    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(201)
      .expect({ message: 'Успешный выход' });

    expect(authServiceMock.logout).toHaveBeenCalledWith(
      'user-1',
      expect.any(Object),
    );
  });
});
