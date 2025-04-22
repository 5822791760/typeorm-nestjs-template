import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Observable } from 'rxjs';

import tzDayjs from '@core/util/common/common.dayjs';

import { CORE_CONTEXT, ICoreContext } from './core-context.common';

@Injectable()
export class CoreContextInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const coreCtx: ICoreContext = {
      traceId: nanoid(),
      requestTime: tzDayjs().toISOString(),
    };
    request[CORE_CONTEXT] = coreCtx;

    return next.handle();
  }
}
