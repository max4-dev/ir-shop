import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database';
import { SessionMiddleware } from './session.middleware';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [SessionService, SessionRepository, SessionMiddleware],
  exports: [SessionService, SessionMiddleware],
})
export class SessionModule {}
