import { UserDto } from '@src/common/dto/user.dto';
import { Task } from '@src/modules/tasks/entities/task.entity';
import { TasksController } from '@src/modules/tasks/tasks.controller';
import { TasksService } from '@src/modules/tasks/tasks.service';
import { TaskStatus } from '@src/modules/tasks/types/tasks.type';
import { randomUUID } from 'crypto';
import { Test } from '@nestjs/testing';
import { mockNotifierProvider } from '@src/modules/notifier/__tests__/notifier.mock';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockUser: UserDto = {
    name: 'Mike',
    email: 'mike@gmail.com',
  };

  const createdTask: Task = {
    title: 'Task 1',
    status: TaskStatus.pending,
    id: randomUUID(),
    index: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService, mockNotifierProvider],
    }).compile();

    tasksService = moduleRef.get(TasksService);
    tasksController = moduleRef.get(TasksController);
  });

  describe('Create task', () => {
    it('should return newly created task', () => {
      const payload = { title: 'Task 1', status: TaskStatus.pending };
      const createSpy = jest
        .spyOn(tasksService, 'create')
        .mockReturnValue(createdTask);
      const response = tasksController.create(payload, mockUser);

      expect(createSpy).toHaveBeenCalledWith(payload, mockUser);
      expect(response).toBe(createdTask);
    });
  });
});
