import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/util/common/common.repo';

import { NewUser } from './users.cli.type';

@Injectable()
export class UsersCliRepo extends BaseRepo {
  async insertBulk(users: NewUser[]) {
    await this.writeDb.insertInto('users').values(users).execute();
  }
}
