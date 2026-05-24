import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { ConfigSchema } from 'src/common/config/app-config/config.schema';
import {
  EMAIL_TOKEN_PURPOSE,
  EmailTokenPayload,
  EmailTokenPurpose,
} from './email-token.constants';
import { RedisService } from './redis.service';

@Injectable()
export class EmailTokenService {
  private readonly PREFIX = 'email_token:';

  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService<ConfigSchema, true>,
  ) {}

  private getKey(purpose: EmailTokenPurpose, token: string): string {
    return `${this.PREFIX}${purpose}:${token}`;
  }

  private getTtl(purpose: EmailTokenPurpose): number {
    if (purpose === EMAIL_TOKEN_PURPOSE.RESET_PASSWORD) {
      return this.config.get('EMAIL_TOKEN_TTL_RESET', { infer: true });
    }
    return this.config.get('EMAIL_TOKEN_TTL_VERIFY', { infer: true });
  }

  async create(
    payload: Omit<EmailTokenPayload, 'purpose'> & { purpose: EmailTokenPurpose },
  ): Promise<string> {
    const token = randomUUID();
    const key = this.getKey(payload.purpose, token);
    await this.redis
      .getClient()
      .setex(key, this.getTtl(payload.purpose), JSON.stringify(payload));
    return token;
  }

  async consume(
    purpose: EmailTokenPurpose,
    token: string,
  ): Promise<EmailTokenPayload | null> {
    const key = this.getKey(purpose, token);
    const raw = await this.redis.getClient().get(key);
    if (!raw) {
      return null;
    }
    await this.redis.getClient().del(key);
    return JSON.parse(raw) as EmailTokenPayload;
  }
}
