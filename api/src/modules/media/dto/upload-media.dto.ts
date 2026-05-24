import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { MEDIA_PATH } from '../media.constants';

export class UploadMediaQueryDto {
  @ApiProperty({
    description:
      'Сущность/папка для сохранения. Допустимы латиница, цифры, дефис и слеш.',
    example: 'products',
  })
  @IsString()
  @IsNotEmpty({ message: 'Укажите сущность для сохранения' })
  @MaxLength(64)
  @Matches(MEDIA_PATH.FOLDER_PATTERN, {
    message: 'Недопустимое имя папки',
  })
  folder!: string;
}
