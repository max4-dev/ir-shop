import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserProfileDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
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

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  role: string;
}
