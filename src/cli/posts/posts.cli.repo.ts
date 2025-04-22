import { Injectable } from '@nestjs/common';

import { BaseRepo } from '@core/util/common/common.repo';

@Injectable()
export class PostsCliRepo extends BaseRepo {}
