import { Module } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Verification,
  VerificationScheme,
} from './schemes/verification.scheme';
import { EmailerModule } from '../emailer/emailer.module';
import { UsersModule } from '../users/users.module';
import { VerificationsController } from './verifications.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtConfigModule } from '../common/jwt/jwt-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationScheme },
    ]),
    EmailerModule,
    UsersModule,
    SessionsModule,
    JwtConfigModule,
  ],
  providers: [VerificationsService],
  controllers: [VerificationsController],
  exports: [VerificationsService],
})
export class VerificationsModule {}
