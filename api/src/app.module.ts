import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './common/database';
import { HealthController } from './common/health/health.controller';
import { HealthService } from './common/health/health.service';
import { MailModule } from './common/integrations/mail/mail.module';
import { RedisModule } from './common/redis/redis.module';
import { validateConfig } from './common/utils';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { CategoryModule } from './modules/category/category.module';
import { MediaModule } from './modules/media/media.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PromoCodeModule } from './modules/promo-code/promo-code.module';
import { ProductModule } from './modules/product/product.module';
import { SessionMiddleware } from './modules/session/session.middleware';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => validateConfig(config),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    RedisModule,
    MailModule,
    SessionModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    UserModule,
    MediaModule,
    CartModule,
    FavoriteModule,
    OrderModule,
    PromoCodeModule,
    PaymentModule,
  ],
  controllers: [HealthController],
  providers: [
    HealthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'api/health', method: RequestMethod.GET },
        { path: 'payments/webhook', method: RequestMethod.POST },
        { path: 'api/payments/webhook', method: RequestMethod.POST },
        { path: 'docs', method: RequestMethod.ALL },
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'api/docs', method: RequestMethod.ALL },
        { path: 'api/docs/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
