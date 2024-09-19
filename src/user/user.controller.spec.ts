import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: UserEntity = {
    id: 1,
    firstName: 'sefa',
    lastName: 'durmus',
    email: 'sefa@gmail.com',
    password: '$2b$12$hHXSuOhk9zIHiozff5eFUuOXYq4q6Aoi11HCfej2Emzc3XIF3pX2O',
    orders: [],
    balance: 0,
  };

  const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        ConfigService,
        JwtAuthGuard,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should call UserService.register and return the user', async () => {
      const registerDTO: RegisterDTO = {
        firstName: 'sefa',
        lastName: 'durmus',
        email: 'sefa@gmail.com',
        password: '123456',
      };
      mockUserService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDTO);
      expect(service.register).toHaveBeenCalledWith(registerDTO);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should call UserService.login and return token and user', async () => {
      const loginDTO: LoginDTO = {
        email: 'sefa@gmail.com',
        password: '123456',
      };
      const expectedResult = {
        token: '$2b$12$hHXSuOhk9zIHiozff5eFUuOXYq4q6Aoi11HCfej2Emzc3XIF3pX2O',
        user: mockUser,
      };

      mockUserService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDTO);
      expect(service.login).toHaveBeenCalledWith(loginDTO);
      expect(result).toEqual(expectedResult);
    });
  });
});
