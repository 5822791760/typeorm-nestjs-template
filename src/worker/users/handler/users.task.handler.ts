import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

import QUEUE from '@core/shared/worker/worker.queue';
import { createTaskHandler } from '@core/shared/worker/worker.util';

import { ProcessSampleData } from '../users.worker.type';

@Injectable()
export class UsersTask {
  async dispatch(job: Job): Promise<void> {
    const { name, data } = job;

    switch (name) {
      case 'sample':
        await this.processSample(data);
        break;
      default:
        return;
    }
  }

  async processSample(data: ProcessSampleData) {
    console.log('==================================');
    console.log(`Sample Proccessed: ${data.key}`);
    console.log('==================================');
  }
}

export const UserTaskHandler = createTaskHandler(QUEUE.users, UsersTask);
