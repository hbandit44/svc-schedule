import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateArgs): Promise<Task> {
    return this.prisma.task.create(data);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TaskWhereInput;
  }): Promise<Task[]> {
    const { skip, take, where } = params;
    return this.prisma.task.findMany({
      skip,
      take,
      where,
    });
  }

  async findOne(schedule_id: string, id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
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
