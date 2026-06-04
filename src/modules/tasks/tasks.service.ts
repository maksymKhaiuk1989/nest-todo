import {Injectable} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {Task} from "@modules/tasks/entities/task.entity";
import {randomUUID} from "node:crypto";

@Injectable()
export class TasksService {
    tasks: Task[] = [];

    create(createTaskDto: CreateTaskDto) {
        const task: Task = {
            ...createTaskDto,
            id: randomUUID(),
            index: this.generateTaskIndex(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        this.tasks.push(task);
        return this.tasks;
    }

    findAll() {
        return this.tasks;
    }

    findOne(id: string) {
        return this.tasks.find((task) => task.id === id);
    }

    update(id: string, updateTaskDto: UpdateTaskDto) {
        const index = this.tasks.findIndex((task) => task.id === id);
3
        if (index !== -1) {
            this.tasks[index] = {
                ...this.tasks[index],
                ...updateTaskDto,
                updatedAt: new Date().toISOString(),
            };
        }

        return this.tasks;
    }

    remove(id: string) {
        return this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    private generateTaskIndex(): number {
        if (this.tasks.length === 0) return 0;

        return this.tasks.reduce((prev, task) => {
                if (task.index <= prev) return task.index + 1;

                return 0;
            }
            , 0
        )
    }
}