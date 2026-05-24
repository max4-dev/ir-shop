import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ValidatePromoCodeDto {
  @ApiProperty({
    example: 'e4a4f6e2-1a4a-4d28-8a2b-9b8a1d6c0f01',
    description: 'UUID промокода',
  })
  @IsUUID('4')
  code: string;
}
