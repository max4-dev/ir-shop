import { Payment, PaymentStatus } from '@prisma/client';

export interface PaymentResponse {
  id: string;
  orderId: string;
  provider: string;
  providerId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  confirmationUrl: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const formatPayment = (payment: Payment): PaymentResponse => ({
  id: payment.id,
  orderId: payment.orderId,
  provider: payment.provider,
  providerId: payment.providerId,
  amount: payment.amount,
  currency: payment.currency,
  status: payment.status,
  confirmationUrl: payment.confirmationUrl,
  paidAt: payment.paidAt,
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt,
});
