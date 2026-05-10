import { Role } from '@prisma/client';

export interface IJWTPayload {
  id: string;
  role: Role;
  tokenVersion: number;
}
