import type { Request } from 'express';

export interface SessionRequest extends Request {
  sessionId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    sessionId?: string;
  }
}
