import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { comparePasswords } from '@/utils/hashing.utils';

jest.mock('../utils/hashing.utils', () => ({
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let comparePasswordsMock: jest.MockedFunction<typeof comparePasswords>;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  } as Partial<UserService>;

  const mockUser = {
    id: 'some-uuid',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(async () => {
    comparePasswordsMock = comparePasswords as jest.MockedFunction<
      typeof comparePasswords
    >;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuthService,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should return null if user is not found', async () => {
    (mockUsersService.findOneByEmail as jest.Mock).mockResolvedValue(null);
    const result = await authService.validateUser(
      'nonexistent@example.com',
      'password',
    );
    expect(result).toBeNull();
  });

  it('should return null if password is incorrect', async () => {
    (mockUsersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    comparePasswordsMock.mockResolvedValue(false);

    const result = await authService.validateUser(
      mockUser.email,
      'wrongpassword',
    );
    expect(result).toBeNull();
  });

  it('should return user data without password if validation is successful', async () => {
    (mockUsersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    comparePasswordsMock.mockResolvedValue(true);

    const result = await authService.validateUser(
      mockUser.email,
      'correctpassword',
    );
    expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
  });
});
