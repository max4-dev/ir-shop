import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadCommand } from './upload.command';

@CommandHandler(UploadCommand)
export class UploadHandler implements ICommandHandler<UploadCommand> {
  client: S3Client;
  bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
      },
      endpoint: 'https://storage.yandexcloud.net',
      region: 'ru-central1',
    });
    this.bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
  }

  async execute({ contentType, file, name }: UploadCommand) {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: name,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
      },
    });

    return upload.done();
  }
}
