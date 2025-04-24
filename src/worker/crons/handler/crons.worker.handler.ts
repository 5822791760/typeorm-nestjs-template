import { Injectable } from '@nestjs/common';

import { CRONS_JOBS } from '@core/queue/crons/crons.queue.common';
import { BaseWorkerHandler } from '@core/shared/worker/worker.abstract';
import { Task } from '@core/shared/worker/worker.decorator';

@Injectable()
export class CronsWorkerHandler extends BaseWorkerHandler {
  @Task(CRONS_JOBS.sample)
  async processSample() {
    console.log('XXxxxXXXXXXXXX');
    console.log(`Cron Test Proccessed`);
    console.log('XXxxxXXXXXXXXX');
  }
}
