import { Injectable } from '@nestjs/common';

import { queryExists } from '@core/db/db.util';
import { BaseRepo } from '@core/util/common/common.repo';

import { AuthenticatedUser, NewUser, User } from './auths.v1.type';

@Injectable()
export class AuthsV1Repo extends BaseRepo {
  async getOneUser(email: string): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .select([
        'id',
        'email',
        'password',
        'createdAt',
        'updatedAt',
        'lastSignedInAt',
      ])
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    return user;
  }

  async insertAuthUser(user: NewUser): Promise<AuthenticatedUser | null> {
    const res = await this.writeDb
      .insertInto('users')
      .values(user)
      .returning(['id'])
      .executeTakeFirst();

    if (!res?.id) {
      return null;
    }

    return {
      ...user,
      id: res.id,
    };
  }

  async updateUser(user: User | AuthenticatedUser) {
    const { id, ...data } = user;

    await this.writeDb
      .updateTable('users')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async isEmailExistsInUsers(email: string): Promise<boolean> {
    const qb = this.db.selectFrom('users').where('email', '=', email);
    return queryExists(qb);
  }
}
