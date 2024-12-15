import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskWithDuration, Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateArgs): Promise<Task> {
    return this.prisma.task.create(data);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TaskWithDurationWhereInput;
  }): Promise<TaskWithDuration[]> {
    const { skip, take, where } = params;

    return this.prisma.taskWithDuration.findMany({
      skip,
      take,
      where,
    });
  }

  async findOne(
    schedule_id: string,
    id: string,
  ): Promise<TaskWithDuration | null> {
    return this.prisma.taskWithDuration.findUnique({
      where: {
        schedule_id,
        id,
      },
    });
  }

  async update(
    schedule_id: string,
    id: string,
    data: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    return this.prisma.task.update({
      data,
      where: {
        schedule_id,
        id,
      },
    });
  }

  async remove(schedule_id: string, id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: {
        schedule_id,
        id,
      },
    });
  }
}
