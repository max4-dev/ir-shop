import { describe, expect, it } from '@jest/globals';
import { GLOBAL_MODULE_METADATA, MODULE_METADATA } from '@nestjs/common/constants';
import { DatabaseModule } from 'src/common/database';
import { SessionMiddleware } from './session.middleware';
import { SessionModule } from './session.module';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

describe('SessionModule', () => {
  it('корректно конфигурирует глобальный модуль', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      SessionModule,
    ) as unknown[] | undefined;
    const providers = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      SessionModule,
    ) as unknown[] | undefined;
    const exportsMetadata = Reflect.getMetadata(
      MODULE_METADATA.EXPORTS,
      SessionModule,
    ) as unknown[] | undefined;
    const isGlobal = Reflect.getMetadata(
      GLOBAL_MODULE_METADATA,
      SessionModule,
    ) as boolean | undefined;

    expect(isGlobal).toBe(true);
    expect(imports).toContain(DatabaseModule);
    expect(providers).toEqual(
      expect.arrayContaining([SessionService, SessionRepository, SessionMiddleware]),
    );
    expect(exportsMetadata).toEqual(
      expect.arrayContaining([SessionService, SessionMiddleware]),
    );
  });
});
