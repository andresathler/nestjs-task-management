import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'User',
  id: 'ID',
  password: 'password',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const results = await taskService.getTask(null, mockUser);
      expect(results).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calss TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Title',
        description: 'Description',
        id: 'ID',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('ID', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calss TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('ID', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
