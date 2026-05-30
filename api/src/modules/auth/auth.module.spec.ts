import { describe, expect, it, jest } from '@jest/globals';
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

import { MODULE_METADATA } from '@nestjs/common/constants';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/common/database';
import { EmailTokenModule } from 'src/common/redis/email-token.module';
import { TokenModule } from 'src/common/redis/token.module';
import { CartModule } from '../cart/cart.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { TokenCookieService } from './services/token-cookie.service';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('AuthModule', () => {
  it('корректно конфигурирует imports/controllers/providers', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AuthModule) as
      | unknown[]
      | undefined;
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      AuthModule,
    ) as unknown[] | undefined;
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      AuthModule,
    ) as unknown[] | undefined;

    expect(imports).toEqual(
      expect.arrayContaining([
        ConfigModule,
        DatabaseModule,
        TokenModule,
        EmailTokenModule,
        CartModule,
        FavoriteModule,
        expect.objectContaining({ module: JwtModule }),
      ]),
    );
    expect(controllers).toContain(AuthController);
    expect(providers).toEqual(
      expect.arrayContaining([AuthService, JwtStrategy, TokenCookieService]),
    );
  });
});
