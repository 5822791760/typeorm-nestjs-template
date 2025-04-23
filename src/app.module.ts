import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { GlobalModule } from '@core/global/global.module';

import { DomainModule } from '@domain/domain.module';

import { CliModule } from './cli/cli.module';
import { MiddlewareModule } from './core/middleware/middleware.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    MiddlewareModule,
    DomainModule,
  ],
})
export class MainAppModule {}

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

@Module({
  imports: [
    // Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    DBModule,
    GlobalModule,
    CliModule,
  ],
})
export class CliAppModule {}
