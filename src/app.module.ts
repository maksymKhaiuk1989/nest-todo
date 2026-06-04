import {Module, ValidationPipe} from '@nestjs/common';
import { TasksModule } from '@modules/tasks/tasks.module';
import {APP_PIPE} from "@nestjs/core";

@Module({
  imports: [TasksModule],
  providers: [{
    provide: APP_PIPE,
    useValue: new ValidationPipe({transform: true})
  }]
})
export class AppModule {}
