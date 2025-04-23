import { Injectable } from '@nestjs/common';

import { BaseTask } from '@core/shared/worker/worker.abstract';
import { Task } from '@core/shared/worker/worker.decorator';

import { ProcessSampleData } from '../users.worker.type';

@Injectable()
export class UsersTask extends BaseTask {
  @Task('sample')
  async processSample(data: ProcessSampleData) {
    console.log('==================================');
    console.log(`Sample Proccessed: ${data.key}`);
    console.log('==================================');
  }

  @Task('test')
  async processTest() {
    console.log('XXxxxXXXXXXXXX');
    console.log(`Test Proccessed: a`);
    console.log('XXxxxXXXXXXXXX');
  }
}
