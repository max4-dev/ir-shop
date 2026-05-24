import { Module } from '@nestjs/common';
import { EmailTokenModule } from 'src/common/redis/email-token.module';
import { TokenModule } from 'src/common/redis/token.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TokenModule, EmailTokenModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
