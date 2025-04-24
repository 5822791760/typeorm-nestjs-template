import { Module } from '@nestjs/common';

import QUEUE from '@core/shared/worker/worker.queue';
import { createWorkerHandler } from '@core/shared/worker/worker.util';

import { UsersWorkerHandler } from './handler/users.worker.handler';
import { UsersWorkerRepo } from './users.worker.repo';

@Module({
  providers: [
    UsersWorkerRepo,

    // Handler
    createWorkerHandler(QUEUE.users, UsersWorkerHandler),
  ],
})
export class UsersWorkerModule {}
