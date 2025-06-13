import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueEnum } from '../enums/queu.enum';
import { JobEnum } from '../enums/job.enum';
import { EmailerService } from '../emailer.service';
import { Logger } from '@nestjs/common';

@Processor(QueueEnum.EMAILER_QUEUE)
export class EmailerConsumer extends WorkerHost {
  private readonly logger = new Logger(EmailerConsumer.name);

  constructor(private readonly _emailerService: EmailerService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case JobEnum.SUBSCRIBE_SUCCESS: {
        await this._emailerService.sendSubscribedSuccess(job.data);

        return {
          done: true,
        };
      }
      case JobEnum.SUBSCRIBE_ONBOARD: {
        await this._emailerService.sendSubscribedOnboard(job.data.email);

        return {
          done: true,
        };
      }
      case JobEnum.SUBSCRIBE_AUTHOR: {
        await this._emailerService.sendSubscribedAuthor(job.data.email);

        return {
          done: true,
        };
      }
      case JobEnum.MOST_POPULAR_PRODUCTS: {
        await this._emailerService.sendMostPopularProducts(job.data.email);

        return {
          done: true,
        };
      }
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(event: any) {
    this.logger.log(`Work ${event.name} with id: ${event.id} completed`);
  }
}
