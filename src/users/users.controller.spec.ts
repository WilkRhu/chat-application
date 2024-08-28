import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { skip } from 'node:test';
import { UserService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
