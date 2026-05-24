export const EMAIL_TOKEN_PURPOSE = {
  VERIFY: 'verify',
  RESET_PASSWORD: 'reset_password',
} as const;

export type EmailTokenPurpose =
  (typeof EMAIL_TOKEN_PURPOSE)[keyof typeof EMAIL_TOKEN_PURPOSE];

export interface EmailTokenPayload {
  userId: string;
  purpose: EmailTokenPurpose;
  email?: string;
}
