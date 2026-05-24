import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserProfileDto {
  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'ivan@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;
}

export class UserPasswordDto {
  @ApiProperty({ example: 'oldPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;

  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  newPassword: string;
}
