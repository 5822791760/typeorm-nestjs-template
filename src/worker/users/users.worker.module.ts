import { Module } from '@nestjs/common';

import { UserTaskHandler } from './handler/users.task.handler';
import { UsersQueue } from './users.queue';
import { UsersWorkerRepo } from './users.worker.repo';

@Module({
  providers: [UserTaskHandler, UsersWorkerRepo, UsersQueue],
  exports: [UsersQueue],
})
export class UsersWorkerModule {}
