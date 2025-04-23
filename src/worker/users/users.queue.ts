import { Injectable } from '@nestjs/common';

import { BaseQueue } from '@core/shared/worker/worker.abstract';
import QUEUE from '@core/shared/worker/worker.queue';

import { ProcessSampleData } from './users.worker.type';

@Injectable()
export class UsersQueue extends BaseQueue {
  queueName = QUEUE.users;

  addJobSample(data: ProcessSampleData) {
    this.q.add('sample', data);
  }
}
