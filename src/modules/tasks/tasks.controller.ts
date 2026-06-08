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
import { IsPublic } from '@common/decorators/is-public.decorator';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { User } from '@common/decorators/user.decorator';
import { UserDto } from '@common/dto/user.dto';

@Controller('tasks')
@UseInterceptors(LoggingInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @User() user: UserDto) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @IsPublic()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @UseFilters(TaskNotFoundFilter)
  findOne(@Param('id') id: string) {
    const task = this.tasksService.findOne(id);

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
