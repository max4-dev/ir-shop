import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiUploadErrorResponses = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Ошибка валидации входных данных',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Файл не найден' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Доступ запрещён — требуется роль ADMIN',
    }),
    ApiUnauthorizedResponse({ description: 'Пользователь не авторизован' }),
  );
