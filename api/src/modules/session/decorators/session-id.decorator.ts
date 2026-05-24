import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const SessionId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const sessionId = request.sessionId;
    if (!sessionId) {
      throw new InternalServerErrorException(
        'Session middleware не выполнился перед обработчиком запроса',
      );
    }
    return sessionId;
  },
);
