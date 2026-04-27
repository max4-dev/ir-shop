import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { TIME } from 'src/common/constants';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: number;
}

@Injectable()
export class TokenCookieService {
  private readonly REFRESH_COOKIE_NAME = 'refreshToken';
  private readonly ACCESS_COOKIE_NAME = 'accessToken';
  private readonly COOKIE_PATH = '/';

  private getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: TIME.IN_MS.ONE_DAY * 15,
      path: this.COOKIE_PATH,
    };
  }

  private getAccessCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: TIME.IN_MS.ONE_DAY * 5,
      path: this.COOKIE_PATH,
    };
  }

  setAuthCookies(res: Response, tokens: AuthTokens): void {
    res.cookie(
      this.REFRESH_COOKIE_NAME,
      tokens.refreshToken,
      this.getRefreshCookieOptions(),
    );
    res.cookie(
      this.ACCESS_COOKIE_NAME,
      tokens.accessToken,
      this.getAccessCookieOptions(),
    );
  }

  clearAuthCookie(res: Response): void {
    const opts = {
      path: this.COOKIE_PATH,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
    };

    res.clearCookie(this.REFRESH_COOKIE_NAME, opts);
    res.clearCookie(this.ACCESS_COOKIE_NAME, opts);
  }

  getRefreshToken(req: Request): string | undefined {
    return (req as any).cookies?.[this.REFRESH_COOKIE_NAME];
  }
}
