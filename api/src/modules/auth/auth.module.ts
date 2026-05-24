import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/common/config/jwt.config';
import { DatabaseModule } from 'src/common/database';
import { EmailTokenModule } from 'src/common/redis/email-token.module';
import { TokenModule } from 'src/common/redis/token.module';
import { CartModule } from '../cart/cart.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenCookieService } from './services/token-cookie.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TokenModule,
    EmailTokenModule,
    CartModule,
    FavoriteModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenCookieService],
})
export class AuthModule {}
