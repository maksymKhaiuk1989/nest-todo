import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from '@modules/tasks/dto/create-task.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsInt()
  @Min(0)
  @IsOptional()
  index: number;
}
