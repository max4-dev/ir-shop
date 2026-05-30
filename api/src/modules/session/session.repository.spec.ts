import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Prisma } from '@prisma/client';
import { SessionRepository } from './session.repository';

describe('SessionRepository', () => {
  let repository: SessionRepository;

  const prismaMock = {
    session: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SessionRepository(prismaMock as any);
  });

  const notFoundError = new Prisma.PrismaClientKnownRequestError(
    'Record not found',
    {
      code: 'P2025',
      clientVersion: 'test',
    },
  );

  it('findById вызывает prisma.session.findUnique', async () => {
    const session = { id: 'sess-1' };
    prismaMock.session.findUnique.mockImplementation(async () => session);

    const result = await repository.findById('sess-1');

    expect(prismaMock.session.findUnique).toHaveBeenCalledWith({
      where: { id: 'sess-1' },
    });
    expect(result).toEqual(session);
  });

  it('findActiveByUserId ищет активную сессию по userId', async () => {
    const session = { id: 'sess-1', userId: 'user-1' };
    prismaMock.session.findFirst.mockImplementation(async () => session);

    const result = await repository.findActiveByUserId('user-1');

    expect(prismaMock.session.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        expiresAt: { gt: expect.any(Date) },
      },
      orderBy: { updatedAt: 'desc' },
    });
    expect(result).toEqual(session);
  });

  it('create создает сессию с вложенным созданием cart', async () => {
    const expiresAt = new Date(Date.now() + 60_000);
    const session = { id: 'sess-1', expiresAt };
    prismaMock.session.create.mockImplementation(async () => session);

    const result = await repository.create({ userId: 'user-1', expiresAt });

    expect(prismaMock.session.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        expiresAt,
        cart: { create: {} },
      },
    });
    expect(result).toEqual(session);
  });

  it('extendTtl возвращает null при P2025', async () => {
    prismaMock.session.update.mockImplementation(async () => {
      throw notFoundError;
    });

    const result = await repository.extendTtl('sess-404', new Date());

    expect(result).toBeNull();
  });

  it('linkUser возвращает null при P2025', async () => {
    prismaMock.session.update.mockImplementation(async () => {
      throw notFoundError;
    });

    const result = await repository.linkUser('sess-404', 'user-1');

    expect(result).toBeNull();
  });

  it('deleteById молча завершается при P2025', async () => {
    prismaMock.session.delete.mockImplementation(async () => {
      throw notFoundError;
    });

    await expect(repository.deleteById('sess-404')).resolves.toBeUndefined();
  });
});
