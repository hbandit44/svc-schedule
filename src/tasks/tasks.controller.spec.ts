import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import * as request from 'supertest';

describe('TasksController', () => {
  let app: INestApplication;
  let controller: TasksController;
  let mockedTaskService: Partial<TasksService>;

  const newTask = {
    account_id: 1,
    start_time: '2025-12-15T10:30:00Z',
    type: 'work',
  };

  const tasksFixtures = [
    {
      account_id: 1,
      start_time: '2030-08-13T06:54:48',
      type: 'work',
    },
    {
      account_id: 2,
      start_time: '',
      type: 'break',
    },
  ];

  beforeEach(async () => {
    mockedTaskService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockedTaskService }],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('HTTP GET /schedules/:id/tasks 400 should error UUID required', async () => {
    return request(app.getHttpServer())
      .get('/schedules/1/tasks')
      .expect(400)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP GET /schedules/:id/tasks 200 should return a list of tasks', async () => {
    (mockedTaskService.findAll as jest.Mock).mockResolvedValue(tasksFixtures);
    return request(app.getHttpServer())
      .get('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks')
      .expect(200)
      .expect(tasksFixtures);
  });

  it('HTTP GET /schedules/:id/tasks 200 should take optional query params', async () => {
    (mockedTaskService.findAll as jest.Mock).mockResolvedValue(tasksFixtures);
    return request(app.getHttpServer())
      .get('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks?account_id=1')
      .expect(200)
      .expect(tasksFixtures);
  });

  it('HTTP GET /schedules/:id/tasks/:id 400 should error UUID required', async () => {
    return request(app.getHttpServer())
      .get('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/1')
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP GET /schedules/:id/tasks/:id 200 should return a tasks', async () => {
    (mockedTaskService.findOne as jest.Mock).mockResolvedValue(
      tasksFixtures[0],
    );
    return request(app.getHttpServer())
      .get(
        '/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/69dfc017-2a9e-4ced-acd1-b961916e28b3',
      )
      .expect(200)
      .expect(tasksFixtures[0]);
  });

  it('HTTP POST /schedules/:id/tasks 400 validatation error', async () => {
    return request(app.getHttpServer())
      .post('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks')
      .send({})
      .expect(400)
      .expect({
        message: 'Validation Failed',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP POST /schedules/:id/tasks 400 validatation error UUID', async () => {
    return request(app.getHttpServer())
      .post('/schedules/8/tasks')
      .send(newTask)
      .expect(400)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP POST /schedules/:id/tasks 201 should create task', async () => {
    (mockedTaskService.create as jest.Mock).mockResolvedValue(newTask);
    return request(app.getHttpServer())
      .post('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks')
      .send(newTask)
      .expect(201)
      .expect(newTask);
  });

  it('HTTP PATCH /schedules/:id/tasks/:id 400 validation error UUID required', async () => {
    return request(app.getHttpServer())
      .patch('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/1')
      .send({
        start_time: '2025-12-15T10:30:00Z',
      })
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP PATCH /schedules/:id/tasks/:id 404 not found ', async () => {
    (mockedTaskService.update as jest.Mock).mockResolvedValue(null);
    await request(app.getHttpServer())
      .patch(
        '/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/69dfc017-2a9e-4ced-acd1-b961916e28b3',
      )
      .send({
        start_time: '2025-12-15T10:30:00Z',
      })
      .expect(404);
  });

  it('HTTP PATCH /schedules/:id/tasks/:id 200 should update task', async () => {
    (mockedTaskService.update as jest.Mock).mockResolvedValue(newTask);
    return request(app.getHttpServer())
      .patch(
        '/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/69dfc017-2a9e-4ced-acd1-b961916e28b3',
      )
      .send({
        start_time: '2025-12-15T10:30:00Z',
        end_time: '2024-12-15T10:30:00Z',
      })
      .expect(200)
      .expect(newTask);
  });

  it('HTTP DELETE /schedules/:id/tasks/:id 400 validation error UUID required', async () => {
    return request(app.getHttpServer())
      .delete('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/1')
      .send({})
      .expect(400)
      .expect({
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP DELETE /schedules/:id/tasks/:id 404 task not found', async () => {
    (mockedTaskService.remove as jest.Mock).mockResolvedValue(null);
    await request(app.getHttpServer())
      .delete(
        '/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/69dfc017-2a9e-4ced-acd1-b961916e28b3',
      )
      .expect(404);
  });

  it('HTTP DELETE /schedules/:id/tasks/:id 200 should delete task', async () => {
    (mockedTaskService.remove as jest.Mock).mockResolvedValue(newTask);
    return request(app.getHttpServer())
      .delete(
        '/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e/tasks/69dfc017-2a9e-4ced-acd1-b961916e28b3',
      )
      .expect(200);
  });
});
