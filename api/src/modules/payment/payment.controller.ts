import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentIdParamDto } from './dto/id-param.dto';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { PaymentResponse } from './payment.mapper';
import { PaymentService } from './payment.service';

@ApiTags('Платежи')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Webhook от ЮКассы' })
  @ApiResponse({ status: 200, description: 'Событие обработано' })
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(@Body() body: WebhookEventDto): Promise<{ ok: true }> {
    await this.paymentService.handleWebhookEvent(body);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Получить платёж по ID' })
  @ApiResponse({ status: 200, description: 'Платёж' })
  @ApiResponse({ status: 404, description: 'Платёж не найден' })
  @Get(':id')
  getById(@Param() { id }: PaymentIdParamDto): Promise<PaymentResponse> {
    return this.paymentService.getById(id);
  }
}
