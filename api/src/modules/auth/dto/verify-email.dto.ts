import { IsUUID } from 'class-validator';

export class VerifyEmailDto {
  @IsUUID('4')
  token: string;
}
