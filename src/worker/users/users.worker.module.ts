import { Module } from '@nestjs/common';

import QUEUE from '@core/shared/worker/worker.queue';
import { createTaskHandler } from '@core/shared/worker/worker.util';

import { UsersTask } from './handler/users.task.handler';
import { UsersQueue } from './users.queue';
import { UsersWorkerRepo } from './users.worker.repo';

@Module({
  providers: [
    UsersWorkerRepo,
    UsersQueue,

    // Handler
    createTaskHandler(QUEUE.users, UsersTask),
  ],
  exports: [UsersQueue],
})
export class UsersWorkerModule {}
