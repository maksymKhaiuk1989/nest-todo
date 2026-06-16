import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from '@modules/tasks/tasks.service';
import { CreateTaskDto } from '@modules/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/tasks/dto/update-task.dto';
import { TaskNotFoundFilter } from '@modules/tasks/filters/task-not-found.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { User } from '@common/decorators/user.decorator';
import { UserEntity } from '@src/modules/user/entities/user.entity';

@Controller('tasks')
@UseInterceptors(LoggingInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserEntity) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @UseFilters(TaskNotFoundFilter)
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);

    if (task) {
      return task;
    }

    throw new NotFoundException();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
