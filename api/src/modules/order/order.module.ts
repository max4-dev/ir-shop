import { forwardRef, Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [forwardRef(() => PaymentModule), PromoCodeModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
