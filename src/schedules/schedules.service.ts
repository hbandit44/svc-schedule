import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Schedule, Prisma } from '@prisma/client';
//import { CreateScheduleDto } from './dto/create-schedule.dto';
//import { UpdateScheduleDto } from './dto/update-schedule.dto';

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

  async findOne(
    scheduleWhereUniqueInput: Prisma.ScheduleWhereUniqueInput,
  ): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: scheduleWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.ScheduleWhereUniqueInput;
    data: Prisma.ScheduleUpdateInput;
  }): Promise<Schedule> {
    const { where, data } = params;
    return this.prisma.schedule.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.ScheduleWhereUniqueInput): Promise<Schedule> {
    return this.prisma.schedule.delete({ where });
  }
}
