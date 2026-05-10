import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UploadCommand } from 'src/common/integrations/bucket/command/upload/upload.command';
import { v4 } from 'uuid';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiMultipleFilesUpload,
  ApiSingleFileUpload,
} from './decorators/api-file-upload.decorator';
import { GenerateService } from './generate.service';
import { ApiUploadErrorResponses } from './responses/upload.responses';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly generateService: GenerateService,
  ) {}

  @ApiOperation({
    summary: 'Загрузка изображения с конвертацией в WebP',
    description:
      'Загружает изображение, конвертирует в WebP и сохраняет в хранилище. Только для администраторов.',
  })
  @ApiSingleFileUpload('media')
  @ApiOkResponse({
    description: 'Изображение успешно загружено и конвертировано',
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'object',
          properties: {
            webP: {
              type: 'string',
              example: 'https://storage.example.com/images/products/uuid.webp',
            },
          },
        },
      },
    },
  })
  @ApiUploadErrorResponses()
  @Auth(Role.ADMIN)
  @Post('upload-image')
  @UseInterceptors(
    FilesInterceptor('media', 10, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string,
  ) {
    if (!folder)
      throw new BadRequestException('Укажите сущность для сохранения');
    if (!file) throw new BadRequestException('Файл не найден');

    const filename = v4();
    const webP = await this.generateService.convertToWebP(file.buffer, 100);
    const resWebP = await this.commandBus.execute(
      new UploadCommand(
        webP,
        `images/${folder}/${filename}.webp`,
        'image/webp',
      ),
    );
    return { urls: { webP: resWebP.Location } };
  }

  @ApiOperation({
    summary: 'Массовая загрузка изображений с конвертацией в WebP',
    description:
      'Принимает несколько изображений, конвертирует каждое в WebP. Только для администраторов.',
  })
  @ApiMultipleFilesUpload('media')
  @ApiOkResponse({
    description: 'Все изображения успешно загружены',
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: {
            type: 'string',
            example: 'https://storage.example.com/images/products/uuid.webp',
          },
        },
      },
    },
  })
  @ApiUploadErrorResponses()
  @Auth(Role.ADMIN)
  @Post('upload-images')
  @UseInterceptors(
    FilesInterceptor('media', 10, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string,
  ) {
    if (!folder) throw new BadRequestException('Укажите папку');
    if (!files?.length) throw new BadRequestException('Файлы не найдены');

    const urls = await Promise.all(
      files.map(async (file) => {
        const filename = v4();
        const webP = await this.generateService.convertToWebP(file.buffer, 100);
        const res = await this.commandBus.execute(
          new UploadCommand(
            webP,
            `images/${folder}/${filename}.webp`,
            'image/webp',
          ),
        );
        return res.Location;
      }),
    );
    return { urls };
  }
}
