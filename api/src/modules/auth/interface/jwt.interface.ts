import { Role } from '@prisma/client';

export interface IJWTPayload {
  id: number;
  role: Role;
  tokenVersion: number;
}
