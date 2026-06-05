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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskNotFoundFilter } from './filters/task-not-found.filter';
import { IsPublic } from '@src/core/decorators/is-public.decorator';
import { LoggingInterceptor } from '@src/core/interceptors/logging.interceptor';
import { User } from '@src/core/decorators/user.decorator';

@Controller('tasks')
@UseInterceptors(LoggingInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @User() user: string) {
    console.log(user);
    return this.tasksService.create(createTaskDto);
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
