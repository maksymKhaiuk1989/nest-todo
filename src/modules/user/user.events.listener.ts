import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener('user')
export class UserEventsListener extends QueueEventsHost {
  private readonly logger = new Logger(UserEventsListener.name);

  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.logger.log(`Processing job ${job.jobId}...`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; prev?: string }) {
    this.logger.log(`Job ${job.jobId} completed.`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; prev?: string }) {
    this.logger.log(`Job ${job.jobId} failed.`);
  }
}
