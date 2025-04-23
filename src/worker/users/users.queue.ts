import { Injectable } from '@nestjs/common';

import { BaseQueue } from '@core/shared/worker/worker.abstract';
import QUEUE from '@core/shared/worker/worker.queue';

import { ProcessSampleData } from './users.worker.type';

@Injectable()
export class UsersQueue extends BaseQueue {
  queueName = QUEUE.users;

  setupCron(): void {
    this.addCron('cron-test', '* * * * *');

    return;
  }

  addJobSample(data: ProcessSampleData) {
    this.addJob('sample', data);
  }
}
