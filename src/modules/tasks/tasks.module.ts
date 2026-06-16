import { Module } from '@nestjs/common';
import { TasksService } from '@modules/tasks/tasks.service';
import { TasksController } from '@modules/tasks/tasks.controller';
import { NotifierModule } from '@src/modules/notifier/notifier.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '@src/modules/tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), NotifierModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
