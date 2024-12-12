import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Schedule, Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ScheduleCreateInput): Promise<Schedule> {
    return this.prisma.schedule.create({ data });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ScheduleWhereUniqueInput;
    where?: Prisma.ScheduleWhereInput;
    orderBy?: Prisma.ScheduleOrderByWithRelationInput;
  }): Promise<Schedule[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.schedule.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
