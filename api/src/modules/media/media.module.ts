import { Module } from '@nestjs/common';
import { BucketModule } from 'src/common/integrations/bucket/bucket.module';
import { GenerateService } from './generate.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [BucketModule],
  controllers: [MediaController],
  providers: [GenerateService, MediaService],
  exports: [MediaService],
})
export class MediaModule {}
