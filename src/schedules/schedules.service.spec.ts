import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('SchedulesService', () => {
  let service: SchedulesService;
  const scheduleFixtures = [
    {
      account_id: 1,
      agent_id: 1,
      start_time: '2030-07-15T14:30:45Z',
    },
    {
      account_id: 1,
      agent_id: 2,
      start_time: '2030-07-15T14:30:45Z',
      end_time: '2030-07-18T14:30:45Z',
    },
    {
      account_id: 2,
      agent_id: 2,
      start_time: '2030-07-15T14:30:45Z',
      end_time: '2030-07-18T14:30:45Z',
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulesService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
    for (const schedule of scheduleFixtures) {
      await service.create(schedule);
    }
  });

  afterAll(async () => {
    const schedules = await service.findAll({});
    for (const schedule of schedules) {
      await service.remove(schedule.id);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findall returns a list of schedules', async () => {
    const schedules = await service.findAll({});
    expect(schedules.length).toEqual(3);
  });

  it('findall filter returns a list of schedules', async () => {
    const schedules = await service.findAll({
      where: {
        account_id: 2,
      },
    });
    expect(schedules.length).toEqual(1);
  });

  it('findOne returns a schedule', async () => {
    const schedules = await service.findAll({});
    const schedule = await service.findOne(schedules[0].id);
    expect(schedule?.id).toEqual(schedules[0].id);
  });

  it('updated updates a schedule', async () => {
    const schedules = await service.findAll({});
    const updatedEndTime = '2040-07-18T14:30:45.000Z';
    const schedule = schedules[0];
    const updatedSchedule = await service.update(schedule.id, {
      end_time: updatedEndTime,
    });
    expect(updatedSchedule.end_time).toEqual(new Date(updatedEndTime));
  });

  it('remove deletes a schedule', async () => {
    const schedules = await service.findAll({});
    const schedule = schedules[0];
    await service.remove(schedule.id);
    const deletedSchedule = await service.findOne(schedule.id);
    expect(deletedSchedule).toBeNull();
  });
});
