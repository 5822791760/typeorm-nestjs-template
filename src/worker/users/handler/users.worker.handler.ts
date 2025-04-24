import { Injectable } from '@nestjs/common';

import {
  ProcessSampleData,
  USERS_JOBS,
} from '@core/queue/users/users.queue.common';
import { BaseWorkerHandler } from '@core/shared/worker/worker.abstract';
import { Task } from '@core/shared/worker/worker.decorator';

@Injectable()
export class UsersWorkerHandler extends BaseWorkerHandler {
  @Task(USERS_JOBS.sample)
  async processSample(data: ProcessSampleData) {
    console.log('==================================');
    console.log(`Sample Proccessed: ${data.key}`);
    console.log('==================================');
  }
}
