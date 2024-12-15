import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Schedule, Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ScheduleCreateInput): Promise<Schedule> {
    return this.prisma.schedule.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ScheduleWhereInput;
  }): Promise<Schedule[]> {
    const { skip, take, where } = params;
    return this.prisma.schedule.findMany({
      skip,
      take,
      where,
    });
  }

  async findOne(id: string): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ScheduleUpdateInput,
  ): Promise<Schedule> {
    return this.prisma.schedule.update({
      data,
      where: { id },
    });
  }

  async remove(id: string): Promise<Schedule> {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
