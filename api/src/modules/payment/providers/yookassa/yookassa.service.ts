import { ICreatePayment, Payment, YooCheckout } from '@a2seven/yoo-checkout';
import {
  BadGatewayException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import { ConfigSchema } from 'src/common/config/app-config';
import {
  YOOKASSA_CURRENCY,
  YOOKASSA_STATUS_MAP,
  YOOKASSA_VAT_CODE,
} from './yookassa.constants';

export interface YookassaReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateYookassaPaymentInput {
  amount: number;
  description: string;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  idempotenceKey: string;
  items: YookassaReceiptItem[];
}

@Injectable()
export class YookassaService implements OnModuleInit {
  private readonly logger = new Logger(YookassaService.name);
  private client!: YooCheckout;
  private returnUrl!: string;

  constructor(
    private readonly configService: ConfigService<ConfigSchema, true>,
  ) {}

  onModuleInit(): void {
    const shopId = this.configService.get('YOOKASSA_SHOP_ID', { infer: true });
    const secretKey = this.configService.get('YOOKASSA_SECRET_KEY', {
      infer: true,
    });

    this.client = new YooCheckout({ shopId, secretKey });
    this.returnUrl = this.configService.get('YOOKASSA_RETURN_URL', {
      infer: true,
    });
  }

  async createPayment(input: CreateYookassaPaymentInput): Promise<Payment> {
    const payload: ICreatePayment = {
      amount: {
        value: this.formatAmount(input.amount),
        currency: YOOKASSA_CURRENCY,
      },
      capture: true,
      description: input.description,
      confirmation: {
        type: 'redirect',
        return_url: `${this.returnUrl}?orderId=${input.orderId}`,
      },
      metadata: {
        orderId: input.orderId,
      },
      receipt: {
        customer: {
          email: input.customerEmail,
          phone: this.normalizePhone(input.customerPhone),
        },
        items: input.items.map((item) => ({
          description: item.description.slice(0, 128),
          quantity: item.quantity.toFixed(3),
          amount: {
            value: this.formatAmount(item.unitPrice),
            currency: YOOKASSA_CURRENCY,
          },
          vat_code: YOOKASSA_VAT_CODE,
          payment_mode: 'full_payment',
          payment_subject: 'commodity',
        })),
      },
    };

    try {
      return await this.client.createPayment(payload, input.idempotenceKey);
    } catch (error) {
      this.logger.error('Failed to create yookassa payment', error);
      throw new BadGatewayException('Не удалось создать платёж в ЮКассе');
    }
  }

  async getPayment(providerId: string): Promise<Payment> {
    try {
      return await this.client.getPayment(providerId);
    } catch (error) {
      this.logger.error(`Failed to get yookassa payment ${providerId}`, error);
      throw new BadGatewayException('Не удалось получить платёж в ЮКассе');
    }
  }

  mapStatus(status: string): PaymentStatus {
    const mapped = YOOKASSA_STATUS_MAP[status];
    if (!mapped) {
      throw new BadGatewayException(`Неизвестный статус платежа: ${status}`);
    }
    return mapped;
  }

  /** Цены в БД хранятся в рублях (целые числа) */
  private formatAmount(amountRub: number): string {
    return amountRub.toFixed(2);
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
