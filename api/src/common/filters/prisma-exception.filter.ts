import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

type PrismaErrorConfig = {
  status: HttpStatus;
  message: (meta: Prisma.PrismaClientKnownRequestError['meta']) => string;
};

const PRISMA_ERROR_MAP: Record<string, PrismaErrorConfig> = {
  P2002: {
    status: HttpStatus.CONFLICT,
    message: () => `Такая запись уже существует`,
  },
  P2025: {
    status: HttpStatus.NOT_FOUND,
    message: () => 'Запись не найдена',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: () => 'Связанная запись не найдена',
  },
  P2014: {
    status: HttpStatus.BAD_REQUEST,
    message: () => 'Нарушение обязательной связи между записями',
  },
  P2016: {
    status: HttpStatus.BAD_REQUEST,
    message: () => 'Ошибка интерпретации запроса',
  },
};

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.warn(`Validation error: ${exception.message}`);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Некорректные данные запроса',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    const errorConfig = PRISMA_ERROR_MAP[exception.code];

    if (errorConfig) {
      const status = errorConfig.status;
      const message = errorConfig.message(exception.meta);

      this.logger.warn(
        `Prisma ${exception.code} on ${request.method} ${request.url}: ${message}`,
      );

      return response.status(status).json({
        statusCode: status,
        message,
        error: HttpStatus[status],
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    this.logger.error(
      `Unhandled Prisma error ${exception.code}: ${exception.message}`,
      exception.stack,
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Внутренняя ошибка сервера',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
