import { IsNotEmpty, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;
}

export class UserPasswordDto {
  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  role: string;
}
