import { describe, expect, it } from '@jest/globals';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { DatabaseModule } from 'src/common/database';
import { CartController } from './cart.controller';
import { CartModule } from './cart.module';
import { CartService } from './cart.service';

describe('CartModule', () => {
  it('корректно конфигурирует модуль', () => {
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, CartModule) as
      | unknown[]
      | undefined;
    const controllers = Reflect.getMetadata(
      MODULE_METADATA.CONTROLLERS,
      CartModule,
    ) as unknown[] | undefined;
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      CartModule,
    ) as unknown[] | undefined;
    const exportsMetadata = Reflect.getMetadata(
      MODULE_METADATA.EXPORTS,
      CartModule,
    ) as unknown[] | undefined;

    expect(imports).toContain(DatabaseModule);
    expect(controllers).toContain(CartController);
    expect(providers).toContain(CartService);
    expect(exportsMetadata).toContain(CartService);
  });
});
