import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Verification,
  VerificationScheme,
} from './schemes/verification.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationScheme },
    ]),
  ],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
