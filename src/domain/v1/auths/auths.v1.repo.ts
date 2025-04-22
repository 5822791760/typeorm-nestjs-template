import { Injectable } from '@nestjs/common';

import { Users } from '@core/db/entities/Users';
import { BaseRepo } from '@core/util/common/common.repo';

import { AuthenticatedUser, NewUser, User } from './auths.v1.type';

@Injectable()
export class AuthsV1Repo extends BaseRepo {
  async getOneUser(email: string): Promise<User | null> {
    return this.from(Users).findOne({ where: { email } });
  }

  async insertAuthUser(data: NewUser): Promise<AuthenticatedUser | null> {
    const newUser = this.from(Users).create(data);
    await this.from(Users).save(newUser);

    return {
      ...data,
      id: newUser.id,
    };
  }

  async updateUser(user: User | AuthenticatedUser) {
    const { id, ...data } = user;

    await this.from(Users).update(id, data);
  }

  async isEmailExistsInUsers(email: string): Promise<boolean> {
    return this.from(Users).existsBy({ email });
  }
}
