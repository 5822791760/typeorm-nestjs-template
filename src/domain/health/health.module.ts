import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthHttpController } from './http/health.http.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthHttpController],
})
export class HealthModule {}
