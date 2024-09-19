import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;

  const mockUser: UserEntity = {
    id: 1,
    firstName: 'sefa',
    lastName: 'durmus',
    email: 'sefa@gmail.com',
    password: '$2b$12$hHXSuOhk9zIHiozff5eFUuOXYq4q6Aoi11HCfej2Emzc3XIF3pX2O',
    orders: [],
    balance: 0,
  };

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      await expect(
        service.register({
          firstName: 'sefa',
          lastName: 'durmus',
          email: 'sefa@gmail.com',
          password: '123456',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash the password and save a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      delete mockUser.password;
      mockRepository.save.mockResolvedValue({
        ...mockUser,
      });
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(
          '$2b$12$hHXSuOhk9zIHiozff5eFUuOXYq4q6Aoi11HCfej2Emzc3XIF3pX2O',
        );

      const newUser = {
        firstName: 'sefa',
        lastName: 'durmus',
        email: 'sefa@gmail.com',
        password: '123456',
      };

      const result = await service.register(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 12);
      expect(mockRepository.save).toHaveBeenCalledWith({
        firstName: 'sefa',
        lastName: 'durmus',
        email: 'sefa@gmail.com',
        password:
          '$2b$12$hHXSuOhk9zIHiozff5eFUuOXYq4q6Aoi11HCfej2Emzc3XIF3pX2O',
      });
      expect(result).toEqual({ ...mockUser });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user validation fails', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      const loginDTO = { email: 'wrong@gmail.com', password: 'wrongPassword' };
      await expect(service.login(loginDTO)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a JWT token and the user on successful login', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      const loginDTO = { email: 'sefa@gmail.com', password: '123456' };

      const result = await service.login(loginDTO);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        user: { ...mockUser, password: undefined },
      });
      expect(result).toEqual({
        token: 'mockJwtToken',
        user: { ...mockUser, password: undefined },
      });
    });
  });
});
