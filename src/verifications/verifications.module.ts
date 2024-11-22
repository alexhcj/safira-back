import { forwardRef, Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Verification,
  VerificationScheme,
} from './schemes/verification.scheme';
import { EmailerModule } from '../emailer/emailer.module';
import { UsersModule } from '../users/users.module';
import { VerificationsController } from './verifications.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationScheme },
    ]),
    EmailerModule,
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  providers: [VerificationsService],
  controllers: [VerificationsController],
  exports: [VerificationsService],
})
export class VerificationsModule {}
