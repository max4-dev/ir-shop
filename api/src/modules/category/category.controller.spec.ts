import { beforeEach, describe, expect, it, jest } from '@jest/globals';
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;

  const categoryServiceMock: jest.Mocked<
    Pick<CategoryService, 'getAll' | 'getById' | 'create' | 'update' | 'delete'>
  > = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CategoryController(
      categoryServiceMock as unknown as CategoryService,
    );
  });

  it('getAll вызывает service.getAll', async () => {
    const categories = [{ id: '1' }];
    categoryServiceMock.getAll.mockResolvedValue(categories as any);

    const result = await controller.getAll();

    expect(categoryServiceMock.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });

  it('getById вызывает service.getById с id', async () => {
    const category = { id: 'cat-1' };
    categoryServiceMock.getById.mockResolvedValue(category as any);

    const result = await controller.getById({ id: 'cat-1' });

    expect(categoryServiceMock.getById).toHaveBeenCalledWith('cat-1');
    expect(result).toEqual(category);
  });

  it('create вызывает service.create с dto', async () => {
    const dto: CategoryDto = { name: 'Смартфоны' };
    const created = { id: 'cat-1', ...dto };
    categoryServiceMock.create.mockResolvedValue(created as any);

    const result = await controller.create(dto);

    expect(categoryServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('update вызывает service.update с id и dto', async () => {
    const dto: CategoryDto = { name: 'Ноутбуки' };
    const updated = { id: 'cat-1', ...dto };
    categoryServiceMock.update.mockResolvedValue(updated as any);

    const result = await controller.update({ id: 'cat-1' }, dto);

    expect(categoryServiceMock.update).toHaveBeenCalledWith('cat-1', dto);
    expect(result).toEqual(updated);
  });

  it('delete вызывает service.delete с id', async () => {
    const response = { message: 'Категория удалена' };
    categoryServiceMock.delete.mockResolvedValue(response);

    const result = await controller.delete({ id: 'cat-1' });

    expect(categoryServiceMock.delete).toHaveBeenCalledWith('cat-1');
    expect(result).toEqual(response);
  });
});
