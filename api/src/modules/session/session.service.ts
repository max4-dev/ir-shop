import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { Request, Response } from 'express';
import { TIME } from 'src/common/constants';
import { SessionRepository } from './session.repository';

const SESSION_TTL_DAYS = 90;
const SESSION_COOKIE_NAME = 'sessionId';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async ensureSession(req: Request, res: Response): Promise<Session> {
    const existingId = this.readSessionIdFromCookie(req);
    if (existingId) {
      const session = await this.sessionRepository.findById(existingId);
      if (session && session.expiresAt > new Date()) {
        return session;
      }
    }

    const session = await this.sessionRepository.create({
      expiresAt: this.buildExpiresAt(),
    });
    this.setSessionCookie(res, session.id);
    return session;
  }

  async extendTtl(sessionId: string): Promise<void> {
    await this.sessionRepository.extendTtl(sessionId, this.buildExpiresAt());
  }

  async attachToUser(
    sessionId: string,
    userId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.linkUser(sessionId, userId);
  }

  async findActiveByUserId(userId: string): Promise<Session | null> {
    return this.sessionRepository.findActiveByUserId(userId);
  }

  async deleteById(id: string): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  readSessionIdFromCookie(req: Request): string | undefined {
    return (req as Request & { cookies?: Record<string, string> }).cookies?.[
      SESSION_COOKIE_NAME
    ];
  }

  setSessionCookie(res: Response, sessionId: string): void {
    res.cookie(SESSION_COOKIE_NAME, sessionId, this.getCookieOptions());
  }

  clearSessionCookie(res: Response): void {
    res.clearCookie(SESSION_COOKIE_NAME, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private buildExpiresAt(): Date {
    return new Date(Date.now() + TIME.IN_MS.ONE_DAY * SESSION_TTL_DAYS);
  }

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: TIME.IN_MS.ONE_DAY * SESSION_TTL_DAYS,
      path: '/',
    };
  }
}
