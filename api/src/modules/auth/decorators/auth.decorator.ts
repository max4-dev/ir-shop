import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from 'src/modules/auth/decorators/role.decorator';
import { RoleGuard } from '../guards/role.guard';

export const Auth = (...roles: Role[]) =>
  applyDecorators(Roles(...roles), UseGuards(AuthGuard('jwt'), RoleGuard));
