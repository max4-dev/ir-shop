import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

const mockGenerateSlug = jest.fn();
const mockUuid = jest.fn();

jest.mock('src/common/utils', () => ({
  generateSlug: (...args: unknown[]) => mockGenerateSlug(...args),
}));

jest.mock('uuid', () => ({
  v4: () => mockUuid(),
}));

describe('CategoryService', () => {
  let service: CategoryService;

  const prismaMock = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CategoryService(prismaMock as any);
  });

  describe('getAll', () => {
    it('возвращает категории с сортировкой по id desc', async () => {
      const categories = [{ id: '2' }, { id: '1' }];
      prismaMock.category.findMany.mockImplementation(async () => categories);

      const result = await service.getAll();

      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'desc' },
      });
      expect(result).toEqual(categories);
    });
  });

  describe('getById', () => {
    it('возвращает категорию если найдена', async () => {
      const category = { id: 'cat-1', name: 'Phones' };
      prismaMock.category.findUnique.mockImplementation(async () => category);

      const result = await service.getById('cat-1');

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
      expect(result).toEqual(category);
    });

    it('бросает NotFoundException если категория не найдена', async () => {
      prismaMock.category.findUnique.mockImplementation(async () => null);

      await expect(service.getById('missing-id')).rejects.toThrow(
        new NotFoundException('Категория не найдена'),
      );
    });
  });

  describe('create', () => {
    it('создает категорию с id и slug', async () => {
      const dto: CategoryDto = { name: 'Смартфоны' };
      mockUuid.mockReturnValue('uuid-1');
      mockGenerateSlug.mockReturnValue('smartfony');
      prismaMock.category.create.mockImplementation(async () => ({
        id: 'uuid-1',
        name: 'Смартфоны',
        slug: 'smartfony-uuid-1',
      }));

      const result = await service.create(dto);

      expect(mockUuid).toHaveBeenCalledTimes(1);
      expect(mockGenerateSlug).toHaveBeenCalledWith('Смартфоны');
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: { id: 'uuid-1', name: 'Смартфоны', slug: 'smartfony-uuid-1' },
      });
      expect(result).toEqual({
        id: 'uuid-1',
        name: 'Смартфоны',
        slug: 'smartfony-uuid-1',
      });
    });
  });

  describe('update', () => {
    it('обновляет категорию после проверки существования', async () => {
      const dto: CategoryDto = { name: 'Ноутбуки' };
      prismaMock.category.findUnique.mockImplementation(async () => ({
        id: 'cat-1',
        name: 'Old',
      }));
      mockGenerateSlug.mockReturnValue('noutbuki');
      prismaMock.category.update.mockImplementation(async () => ({
        id: 'cat-1',
        name: 'Ноутбуки',
        slug: 'noutbuki-cat-1',
      }));

      const result = await service.update('cat-1', dto);

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
      expect(mockGenerateSlug).toHaveBeenCalledWith('Ноутбуки');
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        data: {
          name: 'Ноутбуки',
          slug: 'noutbuki-cat-1',
        },
      });
      expect(result).toEqual({
        id: 'cat-1',
        name: 'Ноутбуки',
        slug: 'noutbuki-cat-1',
      });
    });
  });

  describe('delete', () => {
    it('удаляет категорию и возвращает сообщение', async () => {
      prismaMock.category.findUnique.mockImplementation(async () => ({
        id: 'cat-1',
        name: 'Phones',
      }));
      prismaMock.category.delete.mockImplementation(async () => ({ id: 'cat-1' }));

      const result = await service.delete('cat-1');

      expect(prismaMock.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
      expect(result).toEqual({ message: 'Категория удалена' });
    });
  });
});
