import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  computePaginationMeta,
  getPagination,
} from 'src/helper/pagination.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role || Role.USER,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: FindAllUsersDto) {
    const { role, sort } = query;
    const { skip, take, page, limit } = getPagination(query);

    const where: Prisma.UserWhereInput = { role };

    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      if (field && (order === 'asc' || order === 'desc')) {
        orderBy[field] = order;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip, take, orderBy }),
      this.prisma.user.count({ where }),
    ]);

    const meta = computePaginationMeta(
      typeof total === 'number' ? total : 0,
      typeof limit === 'number' ? limit : 10,
      typeof page === 'number' ? page : 1,
    );

    return { data: users, meta };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Ensure user exists
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Email "${updateUserDto.email}" is already in use.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return deletedUser;
  }
}
