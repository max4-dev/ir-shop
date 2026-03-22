import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 50, ttl: 60 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);

    if (!result) {
      throw new InternalServerErrorException(
        'Произошла ошибка при попытке регистрации',
      );
    }

    return result;
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Throttle({ default: { limit: 50, ttl: 60 } })
  @Post('validate')
  async validatePassword(@Body() dto: LoginDto) {
    return this.authService.validatePassword(dto);
  }

  @Throttle({ default: { limit: 50, ttl: 60 } })
  @Post('login/access-token')
  async getNewTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto.refreshToken);
  }
}
