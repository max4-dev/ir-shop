import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadHandler } from 'src/common/integrations/bucket/command/upload/upload.handler';
import { GenerateService } from './generate.service';
import { MediaController } from './media.controller';

@Module({
  imports: [CqrsModule],
  controllers: [MediaController],
  providers: [GenerateService, UploadHandler],
})
export class MediaModule {}
