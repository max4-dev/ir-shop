import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database';
import { TokenModule } from 'src/common/redis/token.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
