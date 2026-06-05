import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TasksService } from '@modules/tasks/tasks.service';

@Catch(HttpException)
export class TaskNotFoundFilter implements ExceptionFilter {
  constructor(private readonly tasksService: TasksService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const taskId = request.params.id;

    if (exception.getStatus() === 401) {
      return response.status(status).json(exception.getResponse());
    }

    if (typeof taskId === 'string' && !this.tasksService.findOne(taskId)) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Task with this ID does not exist',
        timestamp: new Date().toISOString(),
      });
    }

    return response.status(status).json(exception.getResponse());
  }
}
