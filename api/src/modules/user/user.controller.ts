import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UserPasswordDto, UserProfileDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.ADMIN)
  async getAll() {
    return this.userService.getAll();
  }

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Put('profile')
  @Auth()
  async updateProfile(
    @CurrentUser('id') id: number,
    @Body() dto: UserProfileDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  @Put('password')
  @Auth()
  async updatePassword(
    @CurrentUser('id') id: number,
    @Body() dto: UserPasswordDto,
  ) {
    return this.userService.updatePassword(id, dto);
  }

  @Get('role')
  @Auth()
  async checkRole(@CurrentUser('id') userId: number) {
    return this.userService.checkRole(userId);
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }
}
