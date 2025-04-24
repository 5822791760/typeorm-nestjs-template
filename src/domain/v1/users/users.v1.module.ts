import { Module } from '@nestjs/common';
import { UsersTaskModule } from 'src/task/users/users.task.module';

import { UsersV1HttpController } from './handler/http/users.v1.http.controller';
import { UsersV1Repo } from './users.v1.repo';
import { UsersV1Service } from './users.v1.service';

@Module({
  imports: [UsersTaskModule],
  providers: [UsersV1Service, UsersV1Repo],
  controllers: [UsersV1HttpController],
})
export class UsersV1Module {}
