import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskWithDuration, Prisma, Schedule } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TaskCreateArgs): Promise<Task> {
    return this.prisma.task.create(data);
  }

  async _createWithSchedule(
    data: Prisma.ScheduleCreateArgs,
  ): Promise<Schedule> {
    return this.prisma.schedule.create(data);
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

  async findOne(
    schedule_id: string,
    id: string,
  ): Promise<TaskWithDuration | null> {
    const tasks: TaskWithDuration[] = await this.prisma.$queryRaw`
      select
        id,
        schedule_id,
        start_time,
        end_time,
        (end_time - start_time)::text as duration,
        type
      FROM "Task"
      WHERE
        schedule_id = ${schedule_id}
        AND id = ${id}
    `;
    if (tasks.length === 0) {
      return null;
    } else {
      return tasks[0];
    }
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
