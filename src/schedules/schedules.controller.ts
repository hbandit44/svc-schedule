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
  UsePipes,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import {
  CreateScheduleDto,
  createScheduleSchema,
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
  @UsePipes(new ZodValidationPipe(createScheduleSchema))
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('agent_id', new DefaultValuePipe(0), ParseIntPipe) agent_id: number,
    @Query('account_id', new DefaultValuePipe(0), ParseIntPipe) account_id: number,
  ) {
    const where: Record<string, number> = {};
    if(agent_id && agent_id != 0) {
      where.agent_id = agent_id
    }
    if(account_id && account_id !=0) {
      where.account_id = account_id
    }
    const params = {
      skip,
      take,
      where,
    };
    return this.schedulesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateScheduleSchema)) updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.schedulesService.remove(id);
  }
}
