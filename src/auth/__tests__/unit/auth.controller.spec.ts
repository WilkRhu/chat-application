/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';

import {
  setupTestingModule,
  authServiceMock,
  mockCreateUserDto,
} from '../mocks/test.setup';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await setupTestingModule();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(authService, 'login').mockImplementation(authServiceMock.login);
    jest
      .spyOn(authService, 'create')
      .mockImplementation(authServiceMock.create);
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const req = { user: { uuid: '123', email: 'test@example.com' } };
      const result = { access_token: 'jwt_token' };

      expect(
        await authController.login(req, { email: '', password: '' }),
      ).toEqual(result);
    });
  });

  describe('signUp', () => {
    it('should return user data and token', async () => {
      const createUserDto: CreateUserDto = mockCreateUserDto;

      const result = {
        user: { uuid: '123', email: 'test@example.com' },
        token: 'jwt_token',
      };

      expect(await authController.signUp(createUserDto)).toEqual(result);
    });
  });
});
