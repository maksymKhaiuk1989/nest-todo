import {IsEnum, IsInt, IsNotEmpty, IsString, Min} from "class-validator";
import {TaskStatus} from "@modules/tasks/types/tasks.type";

export class CreateTaskDto {
    @IsInt()
    @Min(0)
    index: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsEnum(TaskStatus, {})
    status: TaskStatus;
}
