import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export interface WebhookEventObject {
  id: string;
  status: string;
  [key: string]: unknown;
}

export class WebhookEventDto {
  @ApiProperty({ example: 'payment.succeeded' })
  @IsString()
  event: string;

  @ApiProperty({
    description: 'Объект платежа от ЮКассы (валидируется по providerId)',
  })
  @IsObject()
  object: WebhookEventObject;
}
