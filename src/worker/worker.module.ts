import { Module } from '@nestjs/common';

import { UsersWorkerModule } from './users/users.worker.module';

@Module({
  imports: [UsersWorkerModule],
})
export class WorkerModule {}
