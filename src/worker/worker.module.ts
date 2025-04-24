import { Module } from '@nestjs/common';

import { CronsWorkerModule } from './crons/crons.worker.module';
import { UsersWorkerModule } from './users/users.worker.module';

@Module({
  imports: [UsersWorkerModule, CronsWorkerModule],
})
export class WorkerModule {}
