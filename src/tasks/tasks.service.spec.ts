import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskType } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  const scheduleFixture = {
    account_id: 1,
    agent_id: 1,
    start_time: '2030-07-15T14:30:45Z',
    tasks: {
      create: [
        {
          account_id: 1,
          start_time: '2030-07-15T14:30:45Z',
          end_time: '2030-07-16T14:30:45Z',
          type: 'work' as TaskType,
        },
        {
          account_id: 1,
          start_time: '2030-07-15T14:30:45Z',
          end_time: '2030-07-16T14:30:45Z',
          type: 'break' as TaskType,
        },
        {
          account_id: 2,
          start_time: '2030-07-15T14:30:45Z',
          end_time: '2030-07-16T14:30:45Z',
          type: 'break' as TaskType,
        },
      ],
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<TasksService>(TasksService);
    await service._createWithSchedule({ data: scheduleFixture });
  });

  afterAll(async () => {
    const tasks = await service.findAll({});
    for (const task of tasks) {
      await service.remove(task.schedule_id, task.id);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return a list of tasks', async () => {
    const tasks = await service.findAll({});
    expect(tasks.length).toEqual(3);
  });

  it('findAll should return a list of filtered tasks', async () => {
    const tasks = await service.findAll({
      where: {
        account_id: 2,
      },
    });
    expect(tasks.length).toEqual(1);
  });

  it('findOne should return a task with its duration', async () => {
    const tasks = await service.findAll({});
    const task = await service.findOne(tasks[0].schedule_id, tasks[0].id);
    expect(task?.duration).toEqual('1 day');
  });

  it('update should update a task', async () => {
    const tasks = await service.findAll({});
    const data = {
      end_time: '2030-07-17T14:30:45Z',
    };
    await service.update(tasks[0].schedule_id, tasks[0].id, data);
    const task = await service.findOne(tasks[0].schedule_id, tasks[0].id);
    expect(task?.duration).toEqual('2 days');
  });

  it('remove should delete a task', async () => {
    const tasks = await service.findAll({});
    await service.remove(tasks[0].schedule_id, tasks[0].id);
    const task = await service.findOne(tasks[0].schedule_id, tasks[0].id);
    expect(task).toBeNull();
  });
});
