import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockUserRepository } from '../mocks/user.service.mock';
import { UserService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Status } from '@/enums/status.enum';
import { RoleEnum } from '@/enums/role.enum';
import { UpdateUserDto } from '@/users/dto/update-user.dto';

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
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'new@example.com',
      name: 'New User',
      password: 'newPassword',
      status: Status.ACTIVATED,
      roles: RoleEnum.ADMIN,
    };

    const result = await userService.create(createUserDto);

    expect(result).toEqual({
      ...createUserDto,
      uuid: '123',
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

  it('should update a user', async () => {
    const uuid = '123';
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
      password: '',
      status: Status.ACTIVATED,
      roles: RoleEnum.ADMIN,
    };

    const result = await userService.update(uuid, updateUserDto);

    expect(result).toEqual({
      uuid: '123',
      email: 'updated@example.com',
      name: 'Updated User',
      password: 'hashedPassword',
      roles: 'admin',
      status: 'activated',
    });
  });

  it('should remove a user', async () => {
    const uuid = '123';
    const result = await userService.remove(uuid);

    expect(result).toBe('User Removed Successfully!');
    expect(userRepository.delete).toHaveBeenCalledWith(uuid);
  });

  it('should return an error message if user removal fails', async () => {
    const uuid = '456';
    const result = await userService.remove(uuid);

    expect(result).toBe('Error removing User');
  });
});
