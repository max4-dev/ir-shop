import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';

export const ApiFolderQuery = () =>
  ApiQuery({
    name: 'folder',
    required: true,
    description: 'Сущность/папка для сохранения. Например: users, products',
    example: 'products',
  });

export const ApiSingleFileUpload = (fieldName = 'media') =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiFolderQuery(),
    ApiBody({
      schema: {
        type: 'object',
        required: [fieldName],
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: 'Медиафайл (jpg, png, webp и др.)',
          },
        },
      },
    }),
  );

export const ApiMultipleFilesUpload = (fieldName = 'media') =>
  applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiFolderQuery(),
    ApiBody({
      schema: {
        type: 'object',
        required: [fieldName],
        properties: {
          [fieldName]: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
            description: 'Массив медиафайлов',
          },
        },
      },
    }),
  );
