import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UserService } from '@src/modules/user/user.service';

export interface ProcessImageJob {
  userId: string;
  image: Express.Multer.File;
}

@Processor('user')
export class UserConsumer extends WorkerHost {
  constructor(private readonly userService: UserService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'process-image': {
        const { userId, image } = job.data as ProcessImageJob;

        return await this.userService.handleUploadProfileImage(image, userId);
      }
    }
  }

  // worker-level event listeners --- used(scoped) only for current consumer "user"
  @OnWorkerEvent('failed')
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
