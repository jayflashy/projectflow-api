import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role, Task, User } from '@prisma/client';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { FindMyTasksDto } from './dto/find-my-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {
  computePaginationMeta,
  getPagination,
} from 'src/helper/pagination.helper';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { assignedToId, projectId, categoryId } = createTaskDto;

    const [user, project, category] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: assignedToId } }),
      this.prisma.project.findUnique({ where: { id: projectId } }),
      this.prisma.category.findUnique({ where: { id: categoryId } }),
    ]);

    if (!user) {
      throw new BadRequestException(
        `User with ID "${assignedToId}" not found.`,
      );
    }
    if (!project) {
      throw new BadRequestException(
        `Project with ID "${projectId}" not found.`,
      );
    }
    if (!category) {
      throw new BadRequestException(
        `Category with ID "${categoryId}" not found.`,
      );
    }

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll(query: FindAllTasksDto) {
    const { status, projectId, categoryId, sort } = query;
    const { skip, take, page, limit } = getPagination(query);

    const where: Prisma.TaskWhereInput = {
      status,
      projectId,
      categoryId,
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput = {};
    if (sort) {
      const [field, order] = sort.split(':');
      if (field && (order === 'asc' || order === 'desc')) {
        orderBy[field] = order;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          user: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);
    const meta = computePaginationMeta(
      typeof total === 'number' ? total : 0,
      typeof limit === 'number' ? limit : 10,
      typeof page === 'number' ? page : 1,
    );

    return { data: tasks, meta };
  }

  async findMyTasks(userId: string, query: FindMyTasksDto) {
    const { status } = query;
    const { skip, take, page, limit } = getPagination(query);

    const where: Prisma.TaskWhereInput = {
      assignedToId: userId,
      status,
    };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const meta = computePaginationMeta(
      typeof total === 'number' ? total : 0,
      typeof limit === 'number' ? limit : 10,
      typeof page === 'number' ? page : 1,
    );

    return { data: tasks, meta };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        project: true,
        category: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    currentUser: User,
  ): Promise<Task> {
    const task = await this.findOne(id);

    const isOwner = task.assignedToId === currentUser.id;
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to edit this task.',
      );
    }

    if (updateTaskDto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: updateTaskDto.assignedToId },
      });
      if (!user)
        throw new BadRequestException(
          `User with ID "${updateTaskDto.assignedToId}" not found.`,
        );
    }
    if (updateTaskDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: updateTaskDto.projectId },
      });
      if (!project)
        throw new BadRequestException(
          `Project with ID "${updateTaskDto.projectId}" not found.`,
        );
    }
    if (updateTaskDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateTaskDto.categoryId },
      });
      if (!category)
        throw new BadRequestException(
          `Category with ID "${updateTaskDto.categoryId}" not found.`,
        );
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }
  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    await this.findOne(id); // Ensures the task exists
    return this.prisma.task.update({
      where: { id },
      data: {
        status: updateTaskStatusDto.status,
      },
    });
  }
  async remove(id: string, currentUser: User): Promise<Task> {
    const task = await this.findOne(id);

    // Authorization Check
    const isOwner = task.assignedToId === currentUser.id;
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this task.',
      );
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
