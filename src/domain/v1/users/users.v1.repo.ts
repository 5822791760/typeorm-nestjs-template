import { Injectable } from '@nestjs/common';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

import { EX } from '@core/db/db.common';
import { queryCount, queryExists } from '@core/db/db.util';
import { isEmptyObject } from '@core/util/common/common.func';
import {
  PaginationOptions,
  getLimit,
  getOffset,
} from '@core/util/common/common.pagintaion';
import { BaseRepo } from '@core/util/common/common.repo';

import { NewUser, User, UserWithPosts } from './users.v1.type';

@Injectable()
export class UsersV1Repo extends BaseRepo {
  async getOneUser(id: number): Promise<User | null> {
    const user = await this.db
      .selectFrom('users')
      .select(['id', 'email', 'createdAt', 'updatedAt', 'password'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db
      .selectFrom('users')
      .select(['id', 'email', 'createdAt', 'updatedAt', 'password'])
      .execute();
  }

  async getPageUsers(options: PaginationOptions): Promise<GetPageUsers> {
    const qb = this.db.selectFrom('users');

    const totalItems = await queryCount(qb);

    const datas = await qb
      .selectAll()
      .offset(getOffset(options))
      .limit(getLimit(options))
      .orderBy('id asc')
      .execute();

    return { datas, totalItems };
  }

  async insertUser(data: NewUser): Promise<void> {
    await this.writeDb.insertInto('users').values(data).execute();
  }

  async updateUser(user: User): Promise<void> {
    const { id, ...data } = user;

    await this.writeDb
      .updateTable('users')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async getAllUsersWithPosts(): Promise<UserWithPosts[]> {
    return this.db
      .selectFrom('users')
      .selectAll()
      .select(({ ref }) => [this._refPosts(ref('users.id')).as('posts')])
      .execute();
  }

  async isEmailExistsInUsers(
    email: string,
    excludeId?: number,
  ): Promise<boolean> {
    let qb = this.db.selectFrom('users').where('email', '=', email);

    if (excludeId) {
      qb = qb.where('id', '<>', excludeId);
    }

    return queryExists(qb);
  }

  getFilterSubquery(query: IGetFilterSubquery) {
    if (isEmptyObject(query)) {
      return null;
    }

    let qb = this.db
      .selectFrom('users')
      .leftJoin('posts', 'users.id', 'posts.createdBy')
      .select('users.id')
      .distinct();

    if (query.email) {
      qb = qb.where('users.email', '=', query.email);
    }

    if (query.postTitle) {
      qb = qb.where('posts.title', '=', query.postTitle);
    }

    return qb;
  }

  private _refPosts(userId: EX<number>) {
    return jsonArrayFrom(
      this.db
        .selectFrom('posts')
        .select(['id', 'title', 'details'])
        .where('posts.createdBy', '=', userId),
    );
  }
}

// ========= Type =========

interface GetPageUsers {
  datas: User[];
  totalItems: number;
}

interface IGetFilterSubquery {
  postTitle?: string;
  email?: string;
}
