import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { RedisService } from 'src/common/redis/redis.service';
import { TIME } from '../const';

export interface TokenData {
  userId: number;
  refreshToken: string;
  role: string;
}

@Injectable()
export class TokenService {
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';

  constructor(private redisService: RedisService) {}

  private getRefreshTokenKey(userId: number): string {
    return `${this.REFRESH_TOKEN_PREFIX}${userId}`;
  }

  async saveRefreshToken(tokenData: TokenData): Promise<void> {
    const key = this.getRefreshTokenKey(tokenData.userId);
    const tokenHash = await hash(tokenData.refreshToken);
    await this.redisService
      .getClient()
      .setex(key, TIME.IN_SEC.ONE_DAY * 30, tokenHash);
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const key = this.getRefreshTokenKey(userId);
    const storedTokenHash = await this.redisService.getClient().get(key);
    if (!storedTokenHash) return false;
    return await verify(storedTokenHash, refreshToken);
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const key = this.getRefreshTokenKey(userId);
    await this.redisService.getClient().del(key);
  }

  async removeAllUserTokens(userId: number): Promise<void> {
    await this.removeRefreshToken(userId);
  }

  async getTokenKey(userId: number): Promise<string | null> {
    const key = this.getRefreshTokenKey(userId);
    const exists = await this.redisService.getClient().exists(key);
    return exists ? key : null;
  }
}
