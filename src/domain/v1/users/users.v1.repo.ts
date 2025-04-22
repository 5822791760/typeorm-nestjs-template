import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Not } from 'typeorm';

import { Users } from '@core/db/entities/Users';
import {
  PaginationOptions,
  getLimit,
  getOffset,
} from '@core/util/common/common.pagintaion';
import { BaseRepo } from '@core/util/common/common.repo';

import { NewUser, User } from './users.v1.type';

@Injectable()
export class UsersV1Repo extends BaseRepo {
  async getOneUser(id: number): Promise<User | null> {
    return this.from(Users).findOne({ where: { id } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.from(Users).find();
  }

  async getPageUsers(options: PaginationOptions): Promise<GetPageUsers> {
    const totalItems = await this.from(Users).count();

    const datas = await this.from(Users).find({
      take: getLimit(options),
      skip: getOffset(options),
      order: { id: 'ASC' },
    });

    return { datas, totalItems };
  }

  async insertUser(data: NewUser): Promise<void> {
    const user = this.from(Users).create(data);
    await this.from(Users).insert(user);
  }

  async updateUser(user: User): Promise<void> {
    const { id, ...data } = user;

    await this.from(Users).update(id, data);
  }

  async isEmailExistsInUsers(
    email: string,
    excludeId?: number,
  ): Promise<boolean> {
    const where: FindOptionsWhere<Users> = { email };

    if (excludeId) {
      where.id = Not(excludeId);
    }

    return this.from(Users).existsBy(where);
  }
}

// ========= Type =========

interface GetPageUsers {
  datas: User[];
  totalItems: number;
}
