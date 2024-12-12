import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [PrismaModule],
})
export class SchedulesModule {}
