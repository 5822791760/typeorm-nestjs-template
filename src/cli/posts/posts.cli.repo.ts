import { Injectable } from '@nestjs/common';

import { Posts } from '@core/db/entities/Posts';
import { Users } from '@core/db/entities/Users';
import { BaseRepo } from '@core/util/common/common.repo';

import { NewPost } from './posts.cli.type';

@Injectable()
export class PostsCliRepo extends BaseRepo {
  async insertBulk(posts: NewPost[]) {
    await this.from(Posts).insert(posts);
  }

  async getUsers() {
    return this.from(Users).find();
  }
}
