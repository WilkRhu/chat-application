import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../../../users/users.service';
import { AuthService } from '../../auth.service';
import { comparePasswords } from '../../../utils/hashing.utils';
import { JwtModule, JwtService } from '@nestjs/jwt';

jest.mock('../../../utils/hashing.utils', () => ({
  comparePasswords: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let comparePasswordsMock: jest.MockedFunction<typeof comparePasswords>;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  } as Partial<UserService>;

  const mockUser = {
    uuid: '123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'admin',
    status: 'activated',
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Limpar os mocks antes de cada teste

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
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
        // Não forneça o JwtService aqui, pois ele já está sendo configurado pelo JwtModule
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
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
    expect(result).toEqual({
      uuid: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      status: 'activated',
    });
  });

  it('should return an access token on login', async () => {
    const user = {
      uuid: '123',
      email: 'test@example.com',
      role: 'user',
      status: 'activated',
    };

    const token = 'jwt.token';
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await authService.login(user);

    expect(jwtService.sign).toHaveBeenCalledWith({
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    expect(result).toEqual({ access_token: token });
  });
});
