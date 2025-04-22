import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '@core/config';
import { DBModule } from '@core/db/db.module';
import { GlobalModule } from '@core/global/global.module';

import { PostsCliModule } from './posts/posts.cli.module';
import { UsersCliModule } from './users/users.cli.module';

@Module({
  imports: [UsersCliModule, PostsCliModule],
})
export class CliModule {}

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
