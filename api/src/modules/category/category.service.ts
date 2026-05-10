import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { generateSlug } from 'src/common/utils';
import { v4 as uuidv4 } from 'uuid';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Категория не найдена');

    return category;
  }

  async create(dto: CategoryDto) {
    const id = uuidv4();
    const category = await this.prisma.category.create({
      data: { id, name: dto.name, slug: `${generateSlug(dto.name)}-${id}` },
    });
    return category;
  }

  async update(id: string, dto: CategoryDto) {
    await this.getById(id);

    return await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: `${generateSlug(dto.name)}-${id}`,
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Категория удалена' };
  }
}
