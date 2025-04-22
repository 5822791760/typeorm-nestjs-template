import { Injectable } from '@nestjs/common';

import { hashString } from '@core/util/common/common.crypto';
import tzDayjs from '@core/util/common/common.dayjs';
import { clone } from '@core/util/common/common.func';
import {
  Err,
  Ok,
  Res,
  ValidateFields,
  validateSuccess,
} from '@core/util/common/common.neverthrow';
import {
  PaginationOptions,
  getPagination,
} from '@core/util/common/common.pagintaion';
import { IPaginationSchema } from '@core/util/http/http.standard';

import { UsersV1Repo } from './users.v1.repo';
import {
  NewUser,
  NewUserData,
  UpdateUserData,
  User,
  UserDetails,
  ValidateUserData,
} from './users.v1.type';

@Injectable()
export class UsersV1Service {
  constructor(private repo: UsersV1Repo) {}

  async getUsers(options: PaginationOptions): Promise<GetUsers> {
    const { datas, totalItems } = await this.repo.getPageUsers(options);

    return {
      datas: datas.map((data) => ({
        id: data.id,
        email: data.email,
        createdAt: data.createdAt,
      })),
      pagination: getPagination(datas, totalItems, options),
    };
  }

  async getUserDetails(id: number): Promise<Res<UserDetails, 'notFound'>> {
    const user = await this.repo.getOneUser(id);

    if (!user) {
      return Err('notFound');
    }

    return Ok({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async postUsers(body: NewUserData): Promise<Res<null, 'validation'>> {
    const r = await this._validateUser(body);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    const newUser = this._newUser(body);

    await this.repo.transaction(async () => {
      this.repo.insertUser(newUser);
    });

    return Ok(null);
  }

  async putUserDetails(
    body: NewUserData,
    id: number,
  ): Promise<Res<null, 'validation' | 'notFound'>> {
    const r = await this._validateUser(body, id);
    if (r.isErr()) {
      return Err('validation', r.error);
    }

    let user = await this.repo.getOneUser(id);
    if (!user) {
      return Err('notFound');
    }

    user = this._updateUser(user, body);

    await this.repo.transaction(async () => {
      this.repo.updateUser(user);
    });

    return Ok(null);
  }

  // ========================== Logic helper ==========================

  private _newUser(data: NewUserData): NewUser {
    return {
      email: data.email,
      password: hashString(data.password),
      createdAt: tzDayjs().toDate(),
      updatedAt: tzDayjs().toDate(),
    };
  }

  private _updateUser(user: User, data: UpdateUserData): User {
    user = clone(user);

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = hashString(data.password);
    }

    user.updatedAt = tzDayjs().toDate();

    return user;
  }

  private async _validateUser(
    data: ValidateUserData,
    excludeId?: number,
  ): Promise<Res<null, 'validation'>> {
    const fields: ValidateFields<ValidateUserData> = {
      email: [],
    };

    const emailExists = await this.repo.isEmailExistsInUsers(
      data.email,
      excludeId,
    );
    if (emailExists) {
      fields.email.push('exists');
    }

    if (!validateSuccess(fields)) {
      return Err('validation', { fields });
    }

    return Ok(null);
  }
}

// ============= type ==========

type GetUsers = {
  datas: UserDetails[];
  pagination: IPaginationSchema;
};
