import { Injectable } from '@nestjs/common';

import { BaseWorkerHandler } from '@core/shared/worker/worker.abstract';
import { Task } from '@core/shared/worker/worker.decorator';

import { ProcessSampleData } from '../users.worker.type';

@Injectable()
export class UsersWorkerHandler extends BaseWorkerHandler {
  @Task('sample')
  async processSample(data: ProcessSampleData) {
    console.log('==================================');
    console.log(`Sample Proccessed: ${data.key}`);
    console.log('==================================');
  }

  @Task('cron-test')
  async processTest() {
    console.log('XXxxxXXXXXXXXX');
    console.log(`Cron Test Proccessed`);
    console.log('XXxxxXXXXXXXXX');
  }
}
