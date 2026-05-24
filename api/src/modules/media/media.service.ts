import { BadRequestException, Injectable } from '@nestjs/common';
import { BucketService } from 'src/common/integrations/bucket/bucket.service';
import { v4 as uuid } from 'uuid';
import { GenerateService } from './generate.service';
import { MEDIA_PATH, MEDIA_WEBP } from './media.constants';
import type { UploadedImage, UploadedImageList } from './media.types';

@Injectable()
export class MediaService {
  constructor(
    private readonly generateService: GenerateService,
    private readonly bucketService: BucketService,
  ) {}

  public async uploadImage(
    file: Express.Multer.File | undefined,
    folder: string,
  ): Promise<UploadedImage> {
    if (!file) throw new BadRequestException('Файл не найден');
    const url = await this.processAndUpload(file, folder);
    return { url };
  }

  public async uploadImages(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ): Promise<UploadedImageList> {
    if (!files?.length) throw new BadRequestException('Файлы не найдены');

    const urls = await Promise.all(
      files.map((file) => this.processAndUpload(file, folder)),
    );

    return { urls };
  }

  private async processAndUpload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const webp = await this.generateService.convertToWebP(
      file.buffer,
      MEDIA_WEBP.QUALITY,
    );
    const key = this.buildKey(folder);
    const result = await this.bucketService.upload(
      webp,
      key,
      MEDIA_WEBP.CONTENT_TYPE,
    );

    if (!result.Location) {
      throw new BadRequestException('Не удалось загрузить файл');
    }

    return result.Location;
  }

  private buildKey(folder: string): string {
    return `${MEDIA_PATH.IMAGES_ROOT}/${folder}/${uuid()}.${MEDIA_WEBP.EXTENSION}`;
  }
}
