import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { skip } from 'node:test';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
