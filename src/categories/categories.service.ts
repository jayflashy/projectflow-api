import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.create({ data: createCategoryDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Category with name "${createCategoryDto.name}" already exists.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<Category[]> {
    const categories: Category[] = await this.prisma.category.findMany();
    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Category with name "${updateCategoryDto.name}" already exists.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string): Promise<Category> {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
