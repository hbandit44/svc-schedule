import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulesModule } from './schedules/schedules.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [SchedulesModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
