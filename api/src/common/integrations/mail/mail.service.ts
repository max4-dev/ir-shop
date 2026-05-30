import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import type { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';
import {
  ConfigSchema,
  NodeEnv,
} from 'src/common/config/app-config/config.schema';
import { ORDER_STATUS_LABELS } from 'src/modules/order/order.labels';
import {
  buildOrderReceiptHtml,
  buildOrderStatusHtml,
  buildPasswordChangedHtml,
  buildResetPasswordHtml,
  buildVerifyEmailHtml,
} from './mail.templates';
import { MailOrderPayload, SendMailOptions } from './mail.types';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService<ConfigSchema, true>) {
    if (!this.isSmtpConfigured()) {
      this.logger.warn(
        'SMTP не настроен — письма будут выводиться в лог (режим разработки)',
      );
    }
  }

  private isSmtpConfigured(): boolean {
    return Boolean(this.config.get('SMTP_HOST', { infer: true }));
  }

  private getTransporter(): Transporter {
    if (!this.transporter) {
      const host = this.config.get('SMTP_HOST', { infer: true });
      const user = this.config.get('SMTP_USER', { infer: true });
      const pass = this.config.get('SMTP_PASSWORD', { infer: true });

      const transportOptions: SMTPTransport.Options = {
        host,
        port: this.config.get('SMTP_PORT', { infer: true }),
        secure: this.config.get('SMTP_SECURE', { infer: true }),
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 10_000,
        ...(user && pass ? { auth: { user, pass } } : {}),
      };

      this.transporter = nodemailer.createTransport({
        ...transportOptions,
        family: 4,
      } as SMTPTransport.Options);
    }
    return this.transporter;
  }

  private getFromAddress(): string {
    const name = this.config.get('MAIL_FROM_NAME', { infer: true });
    const email =
      this.config.get('MAIL_FROM', { infer: true }) ?? 'noreply@ir-shop.local';
    return `"${name}" <${email}>`;
  }

  private getClientUrl(path: string): string {
    const base = this.config
      .get('CLIENT_URL', { infer: true })
      .replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    if (!this.isSmtpConfigured()) {
      const isDev =
        this.config.get('NODE_ENV', { infer: true }) === NodeEnv.DEVELOPMENT;

      if (!isDev) {
        throw new Error('SMTP не настроен');
      }

      this.logger.log(
        [
          '[DEV MAIL]',
          `To: ${options.to}`,
          `Subject: ${options.subject}`,
          options.html
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim(),
        ].join('\n'),
      );
      return;
    }

    await this.getTransporter().sendMail({
      from: this.getFromAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }

  sendMailSafe(options: SendMailOptions): void {
    void this.sendMail(options).catch((error) => {
      this.logger.error(
        `Не удалось отправить письмо на ${options.to}: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
  }

  sendVerifyEmail(params: {
    to: string;
    name: string;
    token: string;
    isEmailChange?: boolean;
  }): void {
    const url = `${this.getClientUrl('/verify-email')}?token=${encodeURIComponent(params.token)}`;
    this.sendMailSafe({
      to: params.to,
      subject: params.isEmailChange
        ? 'Подтвердите новый email — IR Shop'
        : 'Подтвердите аккаунт — IR Shop',
      html: buildVerifyEmailHtml({
        name: params.name,
        url,
        isEmailChange: Boolean(params.isEmailChange),
      }),
    });
  }

  sendResetPasswordEmail(params: {
    to: string;
    name: string;
    token: string;
  }): void {
    const url = `${this.getClientUrl('/reset-password')}?token=${encodeURIComponent(params.token)}`;
    this.sendMailSafe({
      to: params.to,
      subject: 'Сброс пароля — IR Shop',
      html: buildResetPasswordHtml({ name: params.name, url }),
    });
  }

  sendPasswordChangedEmail(params: { to: string; name: string }): void {
    this.sendMailSafe({
      to: params.to,
      subject: 'Пароль изменён — IR Shop',
      html: buildPasswordChangedHtml({ name: params.name }),
    });
  }

  sendOrderReceipt(order: MailOrderPayload): void {
    const orderUrl = this.getClientUrl(`/orders/${order.id}`);
    this.sendMailSafe({
      to: order.customerEmail,
      subject: `Чек по заказу #${order.id.slice(0, 8)} — IR Shop`,
      html: buildOrderReceiptHtml({ order, orderUrl }),
    });
  }

  sendOrderStatus(order: MailOrderPayload, status: OrderStatus): void {
    const statusLabel = ORDER_STATUS_LABELS[status];
    const orderUrl = this.getClientUrl(`/orders/${order.id}`);
    this.sendMailSafe({
      to: order.customerEmail,
      subject: `Заказ #${order.id.slice(0, 8)}: ${statusLabel} — IR Shop`,
      html: buildOrderStatusHtml({ order, statusLabel, orderUrl }),
    });
  }
}
