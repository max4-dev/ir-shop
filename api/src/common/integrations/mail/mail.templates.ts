import { MailOrderPayload } from './mail.types';

const layout = (title: string, body: string): string => `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <h1 style="font-size: 20px; margin: 0 0 16px;">${title}</h1>
    ${body}
    <p style="margin-top: 24px; font-size: 13px; color: #666;">IR Shop</p>
  </div>
</body>
</html>`;

const formatRub = (amount: number): string =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);

const orderItemsHtml = (order: MailOrderPayload): string =>
  order.items
    .map(
      (item) =>
        `<li>${item.productName} × ${item.quantity} — ${formatRub(item.priceWithSale * item.quantity)}</li>`,
    )
    .join('');

export const buildVerifyEmailHtml = (params: {
  name: string;
  url: string;
  isEmailChange: boolean;
}): string => {
  const title = params.isEmailChange
    ? 'Подтвердите новый email'
    : 'Подтвердите аккаунт';
  const intro = params.isEmailChange
    ? `Здравствуйте, ${params.name}! Подтвердите смену email в IR Shop.`
    : `Здравствуйте, ${params.name}! Подтвердите регистрацию в IR Shop.`;

  return layout(
    title,
    `
    <p>${intro}</p>
    <p><a href="${params.url}" style="display:inline-block;padding:12px 20px;background:#f33;color:#fff;text-decoration:none;border-radius:6px;">Подтвердить email</a></p>
    <p style="font-size: 14px; color: #666;">Ссылка действует ограниченное время. Если вы не регистрировались — проигнорируйте письмо.</p>
  `,
  );
};

export const buildResetPasswordHtml = (params: {
  name: string;
  url: string;
}): string =>
  layout(
    'Сброс пароля',
    `
    <p>Здравствуйте, ${params.name}!</p>
    <p>Вы запросили сброс пароля. Нажмите кнопку ниже, чтобы задать новый пароль:</p>
    <p><a href="${params.url}" style="display:inline-block;padding:12px 20px;background:#f33;color:#fff;text-decoration:none;border-radius:6px;">Сбросить пароль</a></p>
    <p style="font-size: 14px; color: #666;">Если вы не запрашивали сброс — проигнорируйте письмо.</p>
  `,
  );

export const buildPasswordChangedHtml = (params: { name: string }): string =>
  layout(
    'Пароль изменён',
    `
    <p>Здравствуйте, ${params.name}!</p>
    <p>Пароль вашего аккаунта IR Shop был изменён.</p>
    <p style="font-size: 14px; color: #666;">Если это были не вы — немедленно восстановите доступ через «Забыли пароль» и свяжитесь с поддержкой.</p>
  `,
  );

export const buildOrderReceiptHtml = (params: {
  order: MailOrderPayload;
  orderUrl: string;
}): string => {
  const { order, orderUrl } = params;
  const discountBlock =
    order.discountPercent > 0
      ? `<p>Скидка: ${order.discountPercent}%${order.appliedPromoCode ? ` (промокод ${order.appliedPromoCode})` : ''}</p>`
      : '';

  return layout(
    `Чек по заказу #${order.id.slice(0, 8)}`,
    `
    <p>Спасибо за оплату, ${order.customerName}!</p>
    <p>Заказ <strong>#${order.id.slice(0, 8)}</strong> оплачен.</p>
    <ul>${orderItemsHtml(order)}</ul>
    <p>Сумма товаров: ${formatRub(order.subtotalPrice)}</p>
    ${discountBlock}
    <p><strong>Итого: ${formatRub(order.totalPrice)}</strong></p>
    <p><a href="${orderUrl}">Открыть заказ</a></p>
  `,
  );
};

export const buildOrderStatusHtml = (params: {
  order: MailOrderPayload;
  statusLabel: string;
  orderUrl: string;
}): string =>
  layout(
    `Статус заказа #${params.order.id.slice(0, 8)}`,
    `
    <p>Здравствуйте, ${params.order.customerName}!</p>
    <p>Статус заказа <strong>#${params.order.id.slice(0, 8)}</strong>: <strong>${params.statusLabel}</strong>.</p>
    <p><a href="${params.orderUrl}">Посмотреть заказ</a></p>
  `,
  );
