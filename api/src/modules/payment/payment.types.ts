export interface CreatePaymentOrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerPhone: string;
  items: CreatePaymentOrderItem[];
}

export interface YookassaWebhookEvent {
  event: string;
  object: {
    id: string;
    status: string;
    [key: string]: unknown;
  };
}
