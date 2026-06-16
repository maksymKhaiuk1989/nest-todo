import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '@modules/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '@modules/tasks/dto/update-task.dto';
import { TaskEntity } from '@modules/tasks/entities/task.entity';
import { randomUUID } from 'node:crypto';
import { Notifier } from '@src/modules/notifier/notifier';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@src/modules/user/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasks: Repository<TaskEntity>,
    private readonly notifier: Notifier,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: UserEntity) {
    const index = await this.generateTaskIndex(user.id);

    const task = {
      ...createTaskDto,
      id: randomUUID(),
      index,
    };
    await this.tasks.save(task);

    this.notifier.performSend(
      `Hello ${user.name}, Your task: "${task.title}" has been created!`,
    );

    return task;
  }

  async findAll() {
    return this.tasks.find();
  }

  async findOne(id: string) {
    return this.tasks.findOneBy({ id });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasks.update(id, updateTaskDto);

    return task;
  }

  async remove(id: string) {
    await this.tasks.delete(id);

    return true;
  }

  private async generateTaskIndex(id: string): Promise<number> {
    const lastTask = await this.tasks.findOne({
      where: { id: id },
      order: { index: 'DESC' },
    });

    const newIndex = lastTask ? lastTask.index + 1 : 0;

    return newIndex;
  }
}
