import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '@modules/tasks/types/tasks.type';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, {}) status: TaskStatus;
}
