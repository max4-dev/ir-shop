import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { MailService } from 'src/common/integrations/mail/mail.service';
import { cartInclude } from '../cart/cart.mapper';
import { PROMO_CODE } from '../promo-code/promo-code.constants';
import { PromoCodeService } from '../promo-code/promo-code.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersRequestDto } from './dto/get-orders.dto';
import {
  formatOrder,
  orderInclude,
  OrderResponse,
  OrderWithRelations,
} from './order.mapper';
import { calcTotalPrice, isOrderOwner } from './order.helpers';
import { PaginatedOrders } from './order.types';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly promoCodeService: PromoCodeService,
    private readonly mailService: MailService,
  ) {}

  async createFromCart(
    sessionId: string,
    userId: string | null,
    dto: CreateOrderDto,
  ): Promise<OrderResponse> {
    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { sessionId },
        include: cartInclude,
      });
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException(
          'Корзина пуста — невозможно создать заказ',
        );
      }

      for (const item of cart.items) {
        if (!item.product.isAvailable) {
          throw new BadRequestException(
            `Товар ${item.productId} недоступен для покупки`,
          );
        }
        if (item.quantity > item.product.availableCount) {
          throw new BadRequestException(
            `Недостаточно товара ${item.productId}: запрошено ${item.quantity}, доступно ${item.product.availableCount}`,
          );
        }
      }

      const subtotalPrice = calcTotalPrice(
        cart.items.map((item) => ({
          priceWithSale: item.product.priceWithSale,
          quantity: item.quantity,
        })),
      );

      const pricing = await this.promoCodeService.consumeForOrder(
        tx,
        userId,
        dto.promoCode,
        subtotalPrice,
      );

      const created = await tx.order.create({
        data: {
          sessionId,
          userId,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail,
          customerPhone: dto.customerPhone,
          deliveryAddress: dto.deliveryAddress,
          status: OrderStatus.PENDING_PAYMENT,
          subtotalPrice,
          discountPercent: pricing.discountPercent,
          appliedPromoCode: pricing.appliedPromoCode,
          totalPrice: pricing.totalPrice,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productSlug: item.product.slug,
              productName: item.product.name,
              productImage: item.product.image,
              price: item.product.price,
              priceWithSale: item.product.priceWithSale,
              quantity: item.quantity,
            })),
          },
        },
        include: orderInclude,
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { availableCount: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return formatOrder(order);
  }

  async getById(
    id: string,
    sessionId: string,
    userId: string | null,
    isAdmin: boolean,
  ): Promise<OrderResponse> {
    const order = await this.findOrderOrFail(id);
    if (!isAdmin && !isOrderOwner(order, sessionId, userId)) {
      throw new ForbiddenException('Доступ к заказу запрещён');
    }
    return formatOrder(order);
  }

  async getMy(
    sessionId: string,
    userId: string | null,
    filter: GetOrdersRequestDto,
  ): Promise<PaginatedOrders> {
    const where: Prisma.OrderWhereInput =
      userId !== null ? { OR: [{ sessionId }, { userId }] } : { sessionId };

    return this.findMany(where, filter);
  }

  async getAll(filter: GetOrdersRequestDto): Promise<PaginatedOrders> {
    return this.findMany({}, filter);
  }

  async cancel(
    id: string,
    sessionId: string,
    userId: string | null,
  ): Promise<OrderResponse> {
    const existing = await this.findOrderOrFail(id);

    if (!isOrderOwner(existing, sessionId, userId)) {
      throw new ForbiddenException('Доступ к заказу запрещён');
    }

    if (existing.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        'Отменить можно только заказ в статусе ожидания оплаты',
      );
    }

    const cancelled = await this.cancelAndRestock(id);
    if (!cancelled) {
      throw new BadRequestException('Не удалось отменить заказ');
    }

    this.mailService.sendOrderStatus(cancelled, OrderStatus.CANCELLED);

    return formatOrder(cancelled);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderResponse> {
    const existing = await this.findOrderOrFail(id);
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });

    if (existing.status !== status) {
      this.notifyOrderStatusChange(updated, status);
    }

    return formatOrder(updated);
  }

  async markPaid(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order || order.status !== OrderStatus.PENDING_PAYMENT) {
      this.logger.warn(
        `Заказ ${id} не переведён в PAID (отсутствует или статус не PENDING_PAYMENT)`,
      );
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: OrderStatus.PAID },
      });

      const reward = await this.promoCodeService.rewardAfterPaidOrder(
        tx,
        order.userId,
      );

      if (reward) {
        this.logger.log(
          `Пользователю ${order.userId} выдан промокод за каждую ${PROMO_CODE.LOYALTY_ORDERS_STEP}-ю оплату`,
        );
      }
    });

    const paidOrder = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });

    if (paidOrder) {
      this.mailService.sendOrderReceipt(paidOrder);
    }
  }

  private notifyOrderStatusChange(
    order: OrderWithRelations,
    status: OrderStatus,
  ): void {
    if (status === OrderStatus.PENDING_PAYMENT) {
      return;
    }

    if (status === OrderStatus.PAID) {
      return;
    }

    this.mailService.sendOrderStatus(order, status);
  }

  private async findOrderOrFail(id: string): Promise<OrderWithRelations> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    return order;
  }

  private async findMany(
    where: Prisma.OrderWhereInput,
    filter: GetOrdersRequestDto,
  ): Promise<PaginatedOrders> {
    const finalWhere: Prisma.OrderWhereInput = {
      ...where,
      ...(filter.status && { status: filter.status }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: finalWhere,
        orderBy: { createdAt: 'desc' },
        skip: filter.offset,
        take: filter.limit,
        include: orderInclude,
      }),
      this.prisma.order.count({ where: finalWhere }),
    ]);

    return { items: items.map(formatOrder), total };
  }

  private async cancelAndRestock(
    id: string,
  ): Promise<OrderWithRelations | null> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!order || order.status !== OrderStatus.PENDING_PAYMENT) {
        return null;
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { availableCount: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: orderInclude,
      });
    });
  }
}
