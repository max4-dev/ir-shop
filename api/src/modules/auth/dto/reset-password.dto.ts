import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID('4')
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  newPassword: string;
}
