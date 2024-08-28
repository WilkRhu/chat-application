import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth.service';
import { UserService } from '../../../users/users.service';
import { comparePasswords } from '../../../utils/hashing.utils';
import { Status } from '@/enums/status.enum';
import { RoleEnum } from '@/enums/role.enum';

jest.mock('../../../utils/hashing.utils', () => ({
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let comparePasswordsMock: jest.MockedFunction<typeof comparePasswords>;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  } as Partial<UserService>;

  const mockJwtService = {
    sign: jest.fn(),
  } as Partial<JwtService>;

  const mockUser = {
    uuid: '123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: RoleEnum.ADMIN,
    status: Status.ACTIVATED,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'fake_secret',
          signOptions: { expiresIn: '60s' },
        }),
        ConfigModule.forRoot(),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    comparePasswordsMock = comparePasswords as jest.MockedFunction<
      typeof comparePasswords
    >;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should return null if user is not found', async () => {
    (mockUserService.findOneByEmail as jest.Mock).mockResolvedValue(null);
    const result = await authService.validateUser(
      'nonexistent@example.com',
      'password',
    );
    expect(result).toBeNull();
  });

  it('should return null if password is incorrect', async () => {
    (mockUserService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    comparePasswordsMock.mockResolvedValue(false);

    const result = await authService.validateUser(
      mockUser.email,
      'wrongpassword',
    );
    expect(result).toBeNull();
  });

  it('should return user data without password if validation is successful', async () => {
    (mockUserService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    comparePasswordsMock.mockResolvedValue(true);

    const result = await authService.validateUser(
      mockUser.email,
      'correctpassword',
    );
    expect(result).toEqual({
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: RoleEnum.ADMIN,
      status: Status.ACTIVATED,
    });
  });

  it('should return an access token on login', async () => {
    const user = {
      uuid: '123',
      email: 'test@example.com',
      role: RoleEnum.ADMIN,
      status: Status.ACTIVATED,
    };
    jest.spyOn(authService, 'login').mockResolvedValue({
      access_token: 'jwt.token',
    });
    const result = await authService.login(user);

    expect(result).toEqual({ access_token: 'jwt.token' });
  });
});
