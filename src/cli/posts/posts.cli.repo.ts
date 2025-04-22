import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/util/common/common.repo';

import { NewPost } from './posts.cli.type';

@Injectable()
export class PostsCliRepo extends BaseRepo {
  async insertBulk(posts: NewPost[]) {
    await this.writeDb.insertInto('posts').values(posts).execute();
  }
}
