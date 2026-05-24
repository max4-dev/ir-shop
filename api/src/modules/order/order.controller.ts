import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/guards/optional-jwt.guard';
import { PaymentService } from 'src/modules/payment/payment.service';
import { SessionId } from 'src/modules/session/decorators/session-id.decorator';
import { CurrentUser } from 'src/modules/user/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersRequestDto } from './dto/get-orders.dto';
import { OrderIdParamDto } from './dto/id-param.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ORDER_PAYMENT_DESCRIPTION } from './order.constants';
import { OrderResponse } from './order.mapper';
import { OrderService } from './order.service';
import { CreateOrderResult, PaginatedOrders } from './order.types';

@ApiTags('Заказы')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  @ApiOperation({ summary: 'Создать заказ из корзины' })
  @ApiResponse({
    status: 201,
    description: 'Заказ создан, payment инициализирован',
  })
  @ApiResponse({ status: 400, description: 'Корзина пуста / нет товара' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(
    @SessionId() sessionId: string,
    @CurrentUser('id') userId: string | undefined,
    @Body() dto: CreateOrderDto,
  ): Promise<CreateOrderResult> {
    const order = await this.orderService.createFromCart(
      sessionId,
      userId ?? null,
      dto,
    );
    const payment = await this.paymentService.createForOrder({
      orderId: order.id,
      amount: order.totalPrice,
      description: ORDER_PAYMENT_DESCRIPTION(order.id),
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items.map((item) => ({
        description: item.productName,
        quantity: item.quantity,
        unitPrice: item.priceWithSale,
      })),
    });

    return {
      order,
      payment,
      confirmationUrl: payment.confirmationUrl,
    };
  }

  @ApiOperation({ summary: 'Мои заказы' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getMy(
    @SessionId() sessionId: string,
    @CurrentUser('id') userId: string | undefined,
    @Query() filter: GetOrdersRequestDto,
  ): Promise<PaginatedOrders> {
    return this.orderService.getMy(sessionId, userId ?? null, filter);
  }

  @ApiOperation({ summary: 'Все заказы (админ)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @Auth(Role.ADMIN)
  @Get('admin')
  getAll(@Query() filter: GetOrdersRequestDto): Promise<PaginatedOrders> {
    return this.orderService.getAll(filter);
  }

  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({ status: 200, description: 'Заказ' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getById(
    @Param() { id }: OrderIdParamDto,
    @SessionId() sessionId: string,
    @CurrentUser('id') userId: string | undefined,
    @CurrentUser('role') role: Role | undefined,
  ): Promise<OrderResponse> {
    return this.orderService.getById(
      id,
      sessionId,
      userId ?? null,
      role === Role.ADMIN,
    );
  }

  @ApiOperation({ summary: 'Отменить заказ (в статусе PENDING_PAYMENT)' })
  @ApiResponse({ status: 200, description: 'Заказ отменён' })
  @ApiResponse({ status: 400, description: 'Заказ нельзя отменить' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @UseGuards(OptionalJwtAuthGuard)
  @Post(':id/cancel')
  cancel(
    @Param() { id }: OrderIdParamDto,
    @SessionId() sessionId: string,
    @CurrentUser('id') userId: string | undefined,
  ): Promise<OrderResponse> {
    return this.orderService.cancel(id, sessionId, userId ?? null);
  }

  @ApiOperation({ summary: 'Изменить статус заказа (админ)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Статус обновлён' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещён' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Auth(Role.ADMIN)
  @Patch('admin/:id/status')
  updateStatus(
    @Param() { id }: OrderIdParamDto,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponse> {
    return this.orderService.updateStatus(id, dto.status);
  }
}
