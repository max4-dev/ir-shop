import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { ValidatePromoCodeDto } from './dto/validate-promo-code.dto';
import { PromoCodeResponse } from './promo-code.mapper';
import { PromoCodeService } from './promo-code.service';
import {
  PromoCodeListResponse,
  ValidatePromoCodeResult,
} from './promo-code.types';

@ApiTags('Промокоды')
@Controller('promo-codes')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @ApiOperation({ summary: 'Мои активные промокоды' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Список промокодов' })
  @Auth()
  @Get('my')
  getMy(@CurrentUser('id') userId: string): Promise<PromoCodeListResponse> {
    return this.promoCodeService.getMy(userId);
  }

  @ApiOperation({ summary: 'Проверить промокод перед оформлением' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Промокод валиден' })
  @ApiResponse({ status: 404, description: 'Промокод не найден' })
  @Auth()
  @Post('validate')
  validate(
    @CurrentUser('id') userId: string,
    @Body() dto: ValidatePromoCodeDto,
  ): Promise<ValidatePromoCodeResult> {
    return this.promoCodeService.validateForUser(userId, dto.code);
  }

  @ApiOperation({ summary: 'Создать промокод для пользователя (админ)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Промокод создан' })
  @Auth(Role.ADMIN)
  @Post('admin')
  createByAdmin(@Body() dto: CreatePromoCodeDto): Promise<PromoCodeResponse> {
    return this.promoCodeService.createByAdmin(
      dto.userId,
      dto.discountPercent,
    );
  }
}
