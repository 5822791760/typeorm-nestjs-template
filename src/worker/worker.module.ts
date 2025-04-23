import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { GlobalModule } from '@core/global/global.module';

import { UsersWorkerModule } from './users/users.worker.module';

@Module({
  imports: [UsersWorkerModule],
})
export class WorkerModule {}

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    WorkerModule,
  ],
})
export class WorkerAppModule {}
