import { PaymentStatus } from '@prisma/client';

export const YOOKASSA_CURRENCY = 'RUB';

/** Без НДС (для тестового магазина) */
export const YOOKASSA_VAT_CODE = 1;

export const YOOKASSA_STATUS_MAP: Record<string, PaymentStatus> = {
  pending: PaymentStatus.PENDING,
  waiting_for_capture: PaymentStatus.WAITING_FOR_CAPTURE,
  succeeded: PaymentStatus.SUCCEEDED,
  canceled: PaymentStatus.CANCELED,
};

export const isYookassaTerminalStatus = (status: PaymentStatus): boolean =>
  status === PaymentStatus.SUCCEEDED || status === PaymentStatus.CANCELED;
