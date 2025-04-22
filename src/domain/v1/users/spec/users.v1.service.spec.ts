import { plainToInstance } from 'class-transformer';
import { Dayjs } from 'dayjs';
import { mock } from 'jest-mock-extended';

import { Users } from '@core/db/entities/Users';
import {
  createTestingModule,
  freezeTestTime,
  mockTransaction,
} from '@core/test/test-util/test-util.common';
import tzDayjs from '@core/util/common/common.dayjs';
import { errIs } from '@core/util/common/common.neverthrow';
import { PaginationOptions } from '@core/util/common/common.pagintaion';

import { UsersV1Module } from '../users.v1.module';
import { UsersV1Repo } from '../users.v1.repo';
import { UsersV1Service } from '../users.v1.service';
import { NewUser, NewUserData, UserDetails } from '../users.v1.type';

describe(`UsersV1Service`, () => {
  const repo = mock<UsersV1Repo>();

  let service: UsersV1Service;
  let current: Dayjs;

  beforeAll(async () => {
    current = tzDayjs();
    freezeTestTime(current);

    const module = await createTestingModule(UsersV1Module)
      .overrideProvider(UsersV1Repo)
      .useValue(repo)
      .compile();

    service = module.get(UsersV1Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe(`getUsers`, () => {
    it('works', async () => {
      // Arrange
      const user: Users = plainToInstance(Users, {
        id: 1,
        email: 'test@example.com',
        password: 'test',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      });

      repo.getPageUsers.mockResolvedValue({
        datas: [user],
        totalItems: 1,
      });

      // Act
      const options: PaginationOptions = {
        page: 1,
        perPage: 1,
      };
      const r = await service.getUsers(options);

      // Assert
      const expectedData: UserDetails[] = [
        {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      ];
      expect(r.datas).toEqual(expectedData);
      expect(repo.getPageUsers).toHaveBeenNthCalledWith(1, options);
    });
  });

  describe(`getUserDetails`, () => {
    it('works', async () => {
      // Arrange
      const id = 1;

      const user: Users = plainToInstance(Users, {
        id: 1,
        email: 'test@example.com',
        password: 'test',
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      });

      repo.getOneUser.mockResolvedValue(user);

      // Act
      const r = await service.getUserDetails(id);

      // Assert
      const expectedResp: UserDetails = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      };
      expect(r._unsafeUnwrap()).toEqual(expectedResp);
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
    });

    it('throws UsersV1NotFoundException', async () => {
      // Arrange
      const id = 1;
      repo.getOneUser.mockResolvedValue(null);

      // Act
      const r = await service.getUserDetails(1);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
    });
  });

  describe(`postUsers`, () => {
    it('works', async () => {
      // Arrange
      const userData: NewUserData = {
        email: 'test@example.com',
        password: 'testuser',
      };

      repo.isEmailExistsInUsers.mockResolvedValue(false);
      repo.insertUser.mockResolvedValue();
      mockTransaction(repo);

      // Act
      const r = await service.postUsers(userData);

      // Assert
      expect(r.isOk()).toEqual(true);
      expect(repo.isEmailExistsInUsers).toHaveBeenNthCalledWith(
        1,
        userData.email,
        undefined,
      );
      expect(repo.transaction).toHaveBeenCalledTimes(1);

      const user: NewUser = {
        email: userData.email,
        password: expect.any(String), // Hashed password
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      };
      expect(repo.insertUser).toHaveBeenNthCalledWith(1, user);
    });

    it('throws validation', async () => {
      // Arrange
      const userData: NewUserData = {
        email: 'test@example.com',
        password: 'testuser',
      };

      repo.isEmailExistsInUsers.mockResolvedValue(true);

      // Act
      const r = await service.postUsers(userData);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'validation')).toEqual(true);
      expect(repo.isEmailExistsInUsers).toHaveBeenNthCalledWith(
        1,
        userData.email,
        undefined,
      );
    });
  });

  describe('putUserDetails', () => {
    it('works', async () => {
      // Arrange
      repo.isEmailExistsInUsers.mockResolvedValue(false);
      repo.getOneUser.mockResolvedValue(
        plainToInstance(Users, {
          id: 1,
          email: 'old@example.com',
          password: 'password',
          createdAt: current.toDate(),
          updatedAt: current.toDate(),
        }),
      );
      mockTransaction(repo);
      repo.updateUser.mockResolvedValue(undefined);

      const body: NewUserData = {
        email: 'update@example.com',
        password: 'updatedPassword',
      };
      const id = 1;

      // Act
      const r = await service.putUserDetails(body, id);

      // Assert
      expect(r.isOk()).toEqual(true);
      expect(repo.isEmailExistsInUsers).toHaveBeenNthCalledWith(
        1,
        body.email,
        id,
      );
      expect(repo.getOneUser).toHaveBeenNthCalledWith(1, id);
      expect(repo.updateUser).toHaveBeenNthCalledWith(1, {
        id: 1,
        email: 'update@example.com',
        password: expect.any(String),
        createdAt: current.toDate(),
        updatedAt: current.toDate(),
      });
    });

    it('throws validation', async () => {
      // Arrange
      repo.isEmailExistsInUsers.mockResolvedValue(true);

      const body: NewUserData = {
        email: 'update@example.com',
        password: 'updatedPassword',
      };
      const id = 1;

      // Act
      const r = await service.putUserDetails(body, id);

      // Assert
      expect(r.isErr()).toEqual(true);

      const e = r._unsafeUnwrapErr();
      expect(errIs(e, 'validation')).toEqual(true);
      expect(e.fields.email).toEqual([expect.any(String)]);
    });

    it('throws notFound', async () => {
      // Arrange
      repo.isEmailExistsInUsers.mockResolvedValue(false);
      repo.getOneUser.mockResolvedValue(null);

      const body: NewUserData = {
        email: 'update@example.com',
        password: 'updatedPassword',
      };
      const id = 1;

      // Act
      const r = await service.putUserDetails(body, id);

      // Assert
      expect(r.isErr()).toEqual(true);
      expect(errIs(r._unsafeUnwrapErr(), 'notFound')).toEqual(true);
    });
  });
});
