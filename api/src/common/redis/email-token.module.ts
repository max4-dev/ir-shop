import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailTokenService } from './email-token.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule, ConfigModule],
  providers: [EmailTokenService],
  exports: [EmailTokenService],
})
export class EmailTokenModule {}
