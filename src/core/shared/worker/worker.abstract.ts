import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';

import { AppConfig } from '@core/config';
import { BullboardService } from '@core/queue/bullboard/bullboard.service';

import { getTaskHandlers } from './worker.decorator';

@Injectable()
export abstract class BaseQueue implements OnModuleInit {
  abstract queueName: string;
  protected queue: Queue;

  constructor(
    private readonly configService: ConfigService,
    private readonly bullboardService: BullboardService,
  ) {}

  onModuleInit() {
    const redisConfig =
      this.configService.getOrThrow<AppConfig['redis']>('redis');

    this.queue = new Queue(this.queueName, {
      connection: { url: redisConfig.url },
    });

    this.bullboardService.addQueue(this.queue);
  }

  addCron(name: string, pattern: string, data?: any) {
    // has job id to prevent duplicates
    // for horizontal scale
    this.queue.add(name, data, { repeat: { pattern }, jobId: name });
  }

  addJob(name: string, data: any) {
    this.queue.add(name, data);
  }
}

export abstract class BaseCronQueue extends BaseQueue {
  abstract setupCron(): void;

  addCron(name: string, pattern: string, data?: any) {
    // has job id to prevent duplicates
    // for horizontal scale
    this.queue.add(name, data, { repeat: { pattern }, jobId: name });
  }

  onModuleInit(): void {
    super.onModuleInit();
    this.setupCron();
  }
}

@Injectable()
export abstract class BaseWorkerHandler {
  private _taskMap: Record<string, string>;

  constructor() {
    this._taskMap = getTaskHandlers(this);
  }

  async dispatch(job: Job): Promise<void> {
    const methodKey = this._taskMap[job.name];
    if (methodKey && typeof (this as any)[methodKey] === 'function') {
      await (this as any)[methodKey](job.data);
    }
  }
}
