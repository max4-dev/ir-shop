import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import {
  ApiMultipleFilesUpload,
  ApiSingleFileUpload,
} from './decorators/api-file-upload.decorator';
import { UploadMediaQueryDto } from './dto/upload-media.dto';
import { MEDIA_FIELD_NAME, MEDIA_LIMITS } from './media.constants';
import { MediaService } from './media.service';
import { ApiUploadErrorResponses } from './responses/upload.responses';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({
    summary: 'Загрузка изображения с конвертацией в WebP',
    description:
      'Загружает изображение, конвертирует в WebP и сохраняет в хранилище. Только для администраторов.',
  })
  @ApiSingleFileUpload(MEDIA_FIELD_NAME)
  @ApiOkResponse({
    description: 'Изображение успешно загружено и конвертировано',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://storage.example.com/images/products/uuid.webp',
        },
      },
    },
  })
  @ApiUploadErrorResponses()
  @Auth(Role.ADMIN)
  @Post('upload-image')
  @UseInterceptors(
    FilesInterceptor(MEDIA_FIELD_NAME, MEDIA_LIMITS.MAX_FILES, {
      limits: { fileSize: MEDIA_LIMITS.MAX_FILE_SIZE_BYTES },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: UploadMediaQueryDto,
  ) {
    return this.mediaService.uploadImage(file, query.folder);
  }

  @ApiOperation({
    summary: 'Массовая загрузка изображений с конвертацией в WebP',
    description:
      'Принимает несколько изображений, конвертирует каждое в WebP. Только для администраторов.',
  })
  @ApiMultipleFilesUpload(MEDIA_FIELD_NAME)
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
    FilesInterceptor(MEDIA_FIELD_NAME, MEDIA_LIMITS.MAX_FILES, {
      limits: { fileSize: MEDIA_LIMITS.MAX_FILE_SIZE_BYTES },
    }),
  )
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() query: UploadMediaQueryDto,
  ) {
    return this.mediaService.uploadImages(files, query.folder);
  }
}
