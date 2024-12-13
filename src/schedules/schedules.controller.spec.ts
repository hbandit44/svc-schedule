import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { PrismaModule } from '../prisma/prisma.module';
import * as request from 'supertest';

describe('SchedulesController', () => {
  let app: INestApplication;
  let controller: SchedulesController;
  let mockedScheduleService: Partial<SchedulesService>;
  const newSchedule = {
    account_id: 3,
    agent_id: 3,
    start_time: '2030-07-15T14:30:45Z',
    end_time: '2031-07-15T14:30:45Z',
  };
  const scheduleFixtures = [
    {
      id: 1,
      agent_id: 1,
    },
    {
      id: 2,
      agent_id: 2,
    },
  ];

  beforeEach(async () => {
    mockedScheduleService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        { provide: SchedulesService, useValue: mockedScheduleService },
      ],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('HTTP GET /schedules 200 should return list of schedules', async () => {
    (mockedScheduleService.findAll as jest.Mock).mockResolvedValue(
      scheduleFixtures,
    );
    await request(app.getHttpServer())
      .get('/schedules')
      .expect(200)
      .expect(scheduleFixtures);
    expect(mockedScheduleService.findAll).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      where: {}
    });
  });

  it('HTTP GET /schedules 200 should return a list of schedules with query params', async () => {
    (mockedScheduleService.findAll as jest.Mock).mockResolvedValue(
      scheduleFixtures,
    );
    await request(app.getHttpServer())
      .get('/schedules?skip=1&take=2&agent_id=1&account_id=1')
      .expect(200)
      .expect(scheduleFixtures);
    expect(mockedScheduleService.findAll).toHaveBeenCalledWith({
      skip: 1,
      take: 2,
      where: {
        agent_id: 1,
        account_id: 1,
      }
    });
  });

  it('HTTP GET /schedules/:id id needs to be a UUID', async () => {
    return request(app.getHttpServer()).get('/schedules/1').expect(400).expect({
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
      statusCode: 400,
    });
  });

  it('HTTP GET /schedules/:id 200 returns a schedule', async () => {
    (mockedScheduleService.findOne as jest.Mock).mockResolvedValue(
      scheduleFixtures[0],
    );
    return request(app.getHttpServer())
      .get('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e')
      .expect(200)
      .expect(scheduleFixtures[0]);
  });

  it('HTTP POST /schedules 400 schema valiation error', async () => {
    return request(app.getHttpServer())
      .post('/schedules')
      .send({})
      .expect(400)
      .expect({
        message: 'Validation Failed',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP POST /schedules 201 creates new schedule', async () => {
    (mockedScheduleService.create as jest.Mock).mockResolvedValue(newSchedule);
    return request(app.getHttpServer())
      .post('/schedules')
      .send(newSchedule)
      .expect(201)
      .expect(newSchedule);
  });

  it('HTTP PATCH /schedules/:id 400 id param needs to be a UUID ', async () => {
    return request(app.getHttpServer())
      .patch('/schedules/8')
      .send(newSchedule)
      .expect(400)
      .expect({
        "message":"Validation failed (uuid is expected)",
        "error":"Bad Request",
        "statusCode":400
      });
  });

  it('HTTP PATCH /schedules 400 schema valiation error', async () => {
    return request(app.getHttpServer())
      .patch('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e')
      .send({
        agent_id: '1',
        account_id: '2',
        start_time: 'now',
        end_time: 'later',
      })
      .expect(400)
      .expect({
        message: 'Validation Failed',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('HTTP PATCH /schedules 200 update schedule', async () => {
    (mockedScheduleService.update as jest.Mock).mockResolvedValue(newSchedule);
    return request(app.getHttpServer())
      .patch('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e')
      .send(newSchedule)
      .expect(200)
      .expect(newSchedule);
  });

  it('HTTP DELETE /schedules/:id 400 id param needs to be a UUID ', async () => {
    return request(app.getHttpServer())
      .delete('/schedules/8')
      .expect(400)
  });

  it('HTTP DELETE /schedules/:id 200 id param needs to be a UUID ', async () => {
    (mockedScheduleService.remove as jest.Mock).mockResolvedValue(newSchedule);
    return request(app.getHttpServer())
      .delete('/schedules/80ba9b34-4640-4427-ae59-e910e3f7191e')
      .expect(200)
  });

});
