import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ example: 'Название категории' })
  @IsString()
  name: string;
}
