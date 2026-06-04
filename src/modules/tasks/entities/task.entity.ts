import {TaskStatus} from "@modules/tasks/types/tasks.type";

export class Task {
    id: string;
    createdAt: string;
    updatedAt: string;
    index: number;
    title: string;
    status: TaskStatus;
}
