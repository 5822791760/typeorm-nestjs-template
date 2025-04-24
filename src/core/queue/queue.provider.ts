import { Provider } from '@nestjs/common';

import { BullboardService } from './bullboard/bullboard.service';
import { CronsQueueService } from './crons/crons.queue.service';
import { UsersQueueService } from './users/users.queue.service';

export const QUEUE_PROVIDER: Provider[] = [
  UsersQueueService,
  CronsQueueService,

  // board
  BullboardService,
];
