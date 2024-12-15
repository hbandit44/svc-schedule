import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
  NotFoundException,
  DefaultValuePipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, CreateTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskSchema } from './dto/update-task.dto';
import { ZodValidationPipe } from '../lib/zod.validator';

@Controller('schedules/:schedule_id/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Param('schedule_id', ParseUUIDPipe) schedule_id: string,
    @Body(new ZodValidationPipe(CreateTaskSchema))
    createTaskDto: CreateTaskDto,
  ) {
    const data = {
      ...createTaskDto,
      schedule: {
        connect: { id: schedule_id },
      },
    };
    return this.tasksService.create({ data });
  }

  @Get()
  async findAll(
    @Param('schedule_id', ParseUUIDPipe) schedule_id: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('account_id', new DefaultValuePipe(0), ParseIntPipe)
    account_id: number,
  ) {
    const where: Record<string, string | number> = {
      schedule_id,
    };
    if (account_id && account_id != 0) {
      where.account_id = account_id;
    }
    const params = {
      skip,
      take,
      where,
    };
    return this.tasksService.findAll(params);
  }

  @Get(':id')
  async findOne(
    @Param('schedule_id', ParseUUIDPipe) schedule_id: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const task = await this.tasksService.findOne(schedule_id, id);
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    return task;
  }

  @Patch(':id')
  async update(
    @Param('schedule_id', ParseUUIDPipe) schedule_id: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateTaskSchema))
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(schedule_id, id, updateTaskDto);
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    return task;
  }

  @Delete(':id')
  async remove(
    @Param('schedule_id', ParseUUIDPipe) schedule_id: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const task = await this.tasksService.remove(schedule_id, id);
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    return task;
  }
}
