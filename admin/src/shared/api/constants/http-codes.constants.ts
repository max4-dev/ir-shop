export const HttpCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
} as const;

export type HttpCode = (typeof HttpCodes)[keyof typeof HttpCodes];
