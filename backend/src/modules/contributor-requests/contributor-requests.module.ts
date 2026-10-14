import { Module } from '@nestjs/common';
import { ContributorRequestsController } from './contributor-requests.controller';
import { ContributorRequestsService } from './contributor-requests.service';

@Module({
  controllers: [ContributorRequestsController],
  providers: [ContributorRequestsService],
})
export class ContributorRequestsModule {}
