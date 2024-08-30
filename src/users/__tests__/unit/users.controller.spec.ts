// src/users/__tests__/user.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUserService } from '../mocks/user.service.mock';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Status } from '@/enums/status.enum';
import { RoleEnum } from '@/enums/role.enum';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest
      .spyOn(userRepository, 'save')
      .mockImplementation(mockUserService.create);
    jest
      .spyOn(userRepository, 'find')
      .mockImplementation(mockUserService.findAll);
    jest
      .spyOn(userRepository, 'findOne')
      .mockImplementation(mockUserService.findOne);
    jest
      .spyOn(userRepository, 'delete')
      .mockImplementation(mockUserService.remove);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      status: Status.ACTIVATED,
      roles: RoleEnum.ADMIN,
    };

    const result = await userService.create(createUserDto);
    expect(result).toEqual({
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
      roles: 'admin',
      status: 'activated',
    });
    expect(userRepository.save).toHaveBeenCalledWith(createUserDto);
  });

  it('should find all users', async () => {
    const result = await userService.findAll();
    expect(result).toEqual([
      {
        uuid: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        roles: 'admin',
        status: 'activated',
      },
    ]);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should find one user by uuid', async () => {
    const uuid = '123';
    const result = await userService.findOne(uuid);
    expect(result).toEqual({
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      roles: 'admin',
      status: 'activated',
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { uuid } });
  });

  it('should remove a user', async () => {
    const uuid = '123';
    const result = await userService.remove(uuid);
    expect(result).toEqual('User Removed Successfully!');
    expect(userRepository.delete).toHaveBeenCalledWith(uuid);
  });
});
