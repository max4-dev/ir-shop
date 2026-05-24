import { forwardRef, Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { YookassaService } from './providers/yookassa/yookassa.service';

@Module({
  imports: [forwardRef(() => OrderModule)],
  controllers: [PaymentController],
  providers: [PaymentService, YookassaService],
  exports: [PaymentService],
})
export class PaymentModule {}
