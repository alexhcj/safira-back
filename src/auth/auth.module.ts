import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { VerificationsModule } from '../verifications/verifications.module';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtConfigModule } from '../common/jwt/jwt-config.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    VerificationsModule,
    SessionsModule,
    JwtConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
