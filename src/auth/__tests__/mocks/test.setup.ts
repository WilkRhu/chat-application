import { TestingModule, Test } from '@nestjs/testing';
import { AuthController } from '../../auth.controller'; // Ajuste o caminho conforme necessário
import { AuthService } from '../../auth.service';
import { UserService } from '../../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Status } from '@/enums/status.enum';
import { RoleEnum } from '@/enums/role.enum';

export const mockAuthService = {
  login: jest.fn(),
  create: jest.fn(),
};

export const mockUserService = {
  create: jest.fn(),
  findOneByEmail: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export async function setupTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
    controllers: [AuthController], // Adicione o controlador aqui
    providers: [
      {
        provide: AuthService,
        useValue: mockAuthService,
      },
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
}

export const authServiceMock = {
  login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
  create: jest.fn().mockResolvedValue({
    user: { uuid: '123', email: 'test@example.com' },
    token: 'jwt_token',
  }),
};

export const mockCreateUserDto: CreateUserDto = {
  name: 'john_doe',
  email: 'john.doe@mail.com',
  password: 'password123',
  status: Status.ACTIVATED,
  roles: RoleEnum.ADMIN,
};
