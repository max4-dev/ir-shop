import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { generateSlug } from 'src/common/utils';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async getById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Категория не найдена');

    return category;
  }

  async create(dto: CategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: { name: dto.name, slug: '' },
      });

      return await this.prisma.category.update({
        where: { id: category.id },
        data: { slug: `${generateSlug(dto.name)}-${category.id}` },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при создании категории');
    }
  }

  async update(id: number, dto: CategoryDto) {
    await this.getById(id);

    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
          slug: `${generateSlug(dto.name)}-${id}`,
        },
      });
    } catch {
      throw new InternalServerErrorException('Ошибка при обновлении категории');
    }
  }

  async delete(id: number) {
    await this.getById(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Категория удалена' };
  }
}
