import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role, Task, User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { FindMyTasksDto } from './dto/find-my-tasks.dto';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The created task record.' })
  create(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all tasks with filters and pagination' })
  @ApiResponse({ status: 200, description: 'A paginated list of tasks.' })
  findAll(@Query(ValidationPipe) query: FindAllTasksDto) {
    return this.tasksService.findAll(query);
  }

  @Get('my')
  @ApiOperation({ summary: "Get the logged-in user's assigned tasks" })
  @ApiResponse({ status: 200, description: 'A paginated list of tasks.' })
  findMyTasks(
    @AuthUser() user: User,
    @Query(ValidationPipe) query: FindMyTasksDto,
  ) {
    return this.tasksService.findMyTasks(user.id, query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'A single task record.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'The updated task record.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @AuthUser() user: User,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto, user);
  }
  @Patch(':id/status')
  @ApiOperation({ summary: "Update a task's status" })
  @ApiResponse({
    status: 200,
    description: 'The task with the updated status.',
  })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'The deleted task record.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthUser() user: User,
  ): Promise<Task> {
    return this.tasksService.remove(id, user);
  }
}
