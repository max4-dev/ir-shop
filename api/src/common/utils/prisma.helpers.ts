import { Prisma } from '@prisma/client';

export const isPrismaRecordNotFound = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2025';
