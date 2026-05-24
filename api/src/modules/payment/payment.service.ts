import { randomUUID } from 'node:crypto';
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { OrderService } from '../order/order.service';
import { formatPayment, PaymentResponse } from './payment.mapper';
import { PAYMENT_CURRENCY, PAYMENT_PROVIDER } from './payment.constants';
import { toJsonValue } from './payment.helpers';
import { CreatePaymentInput, YookassaWebhookEvent } from './payment.types';
import { YookassaService } from './providers/yookassa/yookassa.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassaService: YookassaService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async createForOrder(input: CreatePaymentInput): Promise<PaymentResponse> {
    const paymentId = randomUUID();

    const payment = await this.prisma.payment.create({
      data: {
        id: paymentId,
        orderId: input.orderId,
        amount: input.amount,
        provider: PAYMENT_PROVIDER.YOOKASSA,
        currency: PAYMENT_CURRENCY.RUB,
      },
    });

    const remote = await this.yookassaService.createPayment({
      amount: input.amount,
      description: input.description,
      orderId: input.orderId,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      idempotenceKey: paymentId,
      items: input.items,
    });

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerId: remote.id,
        confirmationUrl: remote.confirmation?.confirmation_url ?? null,
        status: this.yookassaService.mapStatus(remote.status),
        rawPayload: toJsonValue(remote),
      },
    });

    return formatPayment(updated);
  }

  async getById(id: string): Promise<PaymentResponse> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Платёж не найден');
    }
    return formatPayment(payment);
  }

  async handleWebhookEvent(event: YookassaWebhookEvent): Promise<void> {
    const providerId = event.object?.id;
    if (typeof providerId !== 'string' || providerId.length === 0) {
      this.logger.warn('Webhook payload без валидного object.id');
      return;
    }

    const payment = await this.findByProviderId(providerId);
    if (!payment) {
      this.logger.warn(`Payment с providerId=${providerId} не найден`);
      return;
    }

    const verified = await this.yookassaService.getPayment(providerId);
    const newStatus = this.yookassaService.mapStatus(verified.status);

    if (payment.status === newStatus) {
      return;
    }

    const paidAt =
      newStatus === PaymentStatus.SUCCEEDED ? new Date() : undefined;

    await this.updateStatus(payment.id, {
      status: newStatus,
      rawPayload: toJsonValue(verified),
      paidAt,
    });

    if (newStatus === PaymentStatus.SUCCEEDED) {
      await this.orderService.markPaid(payment.orderId);
    }
  }

  private async findByProviderId(providerId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { providerId } });
  }

  private async updateStatus(
    id: string,
    data: {
      status: PaymentStatus;
      rawPayload?: Prisma.InputJsonValue;
      paidAt?: Date;
    },
  ): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }
}
