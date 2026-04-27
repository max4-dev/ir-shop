import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ivan@example.com' })
  @IsEmail()
  email: string;
}

export class UserPasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsString()
  newPassword: string;
}

export class UserDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'ivan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  @IsString()
  role: string;
}
