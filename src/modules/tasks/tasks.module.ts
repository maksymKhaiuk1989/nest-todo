import { Module } from '@nestjs/common';
import { TasksService } from '@modules/tasks/tasks.service';
import { TasksController } from '@modules/tasks/tasks.controller';
import { NotifierModule } from '../notifier/notifier.module';

@Module({
  imports: [NotifierModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
