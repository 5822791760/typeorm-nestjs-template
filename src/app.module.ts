import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { GlobalModule } from '@core/global/global.module';

import { DomainModule } from '@domain/domain.module';

import { MiddlewareModule } from './core/middleware/middleware.module';

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
export class AppModule {}
