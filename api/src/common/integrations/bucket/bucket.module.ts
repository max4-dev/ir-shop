import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadHandler } from './command/upload/upload.handler';

@Module({
  imports: [CqrsModule],
  providers: [UploadHandler],
})
export class BucketModule {}
