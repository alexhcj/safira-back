import { Module } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { EmailerController } from './emailer.controller';
import { BullModule } from '@nestjs/bullmq';
import { EmailerConsumer } from './consumer/emailer.consumer';
import { QueueEnum } from './enums/queu.enum';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionScheme } from './scheme/subscription.scheme';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionScheme },
    ]),
    BullModule.registerQueue({
      name: QueueEnum.EMAILER_QUEUE,
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [EmailerController],
  providers: [EmailerService, EmailerConsumer],
  exports: [EmailerService],
})
export class EmailerModule {}
