import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Пользователи')
@ApiCookieAuth('access_token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить всех пользователей (только админ)' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  @Get()
  @Auth(Role.ADMIN)
  async getAll() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Получить свой профиль' })
  @ApiResponse({ status: 200, description: 'Профиль текущего пользователя' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiResponse({ status: 200, description: 'Профиль обновлён' })
  @ApiResponse({ status: 400, description: 'Email уже используется' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Put('profile')
  @Auth()
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UserProfileDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @ApiOperation({ summary: 'Обновить пароль' })
  @ApiResponse({ status: 200, description: 'Пароль обновлён' })
  @ApiResponse({ status: 400, description: 'Неверный пароль' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Put('password')
  @Auth()
  async updatePassword(
    @CurrentUser('id') id: number,
    @Body() dto: UserPasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @ApiOperation({ summary: 'Проверить роль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Роль пользователя',
    schema: { example: { role: 'USER' } },
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @Get('role')
  @Auth()
  async checkRole(@CurrentUser('id') userId: number) {
    return this.userService.checkRole(userId);
  }

  @ApiOperation({ summary: 'Получить пользователя по ID (только админ)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Пользователь' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  @Get(':id')
  @Auth(Role.ADMIN)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Удалить пользователя (только админ)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 403, description: 'Нет доступа' })
  @Delete(':id')
  @Auth(Role.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
