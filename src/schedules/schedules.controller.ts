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
  DefaultValuePipe,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import {
  CreateScheduleDto,
  CreateScheduleSchema,
} from './dto/create-schedule.dto';
import {
  UpdateScheduleDto,
  UpdateScheduleSchema,
} from './dto/update-schedule.dto';
import { ZodValidationPipe } from '../lib/zod.validator';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateScheduleSchema))
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  async findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('agent_id', new DefaultValuePipe(0), ParseIntPipe) agent_id: number,
    @Query('account_id', new DefaultValuePipe(0), ParseIntPipe)
    account_id: number,
  ) {
    const where: Record<string, number> = {};
    if (agent_id && agent_id != 0) {
      where.agent_id = agent_id;
    }
    if (account_id && account_id != 0) {
      where.account_id = account_id;
    }
    const params = {
      skip,
      take,
      where,
    };
    return this.schedulesService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const schedule = await this.schedulesService.findOne(id);
    if (!schedule) {
      throw new NotFoundException('schedule not found');
    }
    return schedule;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateScheduleSchema))
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.schedulesService.update(id, updateScheduleDto);
    if (!schedule) {
      throw new NotFoundException('schedule not found');
    }
    return schedule;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const schedule = await this.schedulesService.remove(id);
    if (!schedule) {
      throw new NotFoundException('schedule not found');
    }
    return schedule;
  }
}
