import { faker } from '@faker-js/faker';
import { Command, CommandRunner, Option } from 'nest-commander';

import tzDayjs from '@core/util/common/common.dayjs';
import { getRandomId } from '@core/util/common/common.func';

import { PostsCliRepo } from '../posts.cli.repo';
import { NewPost } from '../posts.cli.type';

interface CommandOptions {
  amount: number;
}

@Command({
  name: 'posts:seed',
  description: 'Create record in posts table',
})
export class PostsCliSeed extends CommandRunner {
  constructor(private repo: PostsCliRepo) {
    super();
  }

  async run(_passedParams: string[], options: CommandOptions): Promise<void> {
    const posts: NewPost[] = [];
    const users = await this.repo.getUsers();

    for (let i = 0; i < options.amount; i++) {
      const data: NewPost = {
        title: faker.book.title(),
        details: faker.lorem.lines(),
        createdBy: { id: getRandomId(users) },
        createdAt: tzDayjs().toDate(),
        updatedAt: tzDayjs().toDate(),
      };

      posts.push(data);
    }

    await this.repo.transaction(async () => {
      this.repo.insertBulk(posts);
    });
  }

  @Option({
    flags: '-a, --amount [number]',
    defaultValue: '1',
    description: 'Amount of data to insert',
  })
  parseAmount(val: string): number {
    return Number(val) || 1;
  }
}
