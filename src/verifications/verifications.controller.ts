import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('verifications')
export class VerificationsController {
  private readonly logger = new Logger(VerificationsController.name);

  constructor(private verificationsService: VerificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(@Req() req, @Body() data: { code: string }) {
    this.logger.log('Handling verifyEmail() request');
    return this.verificationsService.verifyEmail({
      userId: req.user.userId,
      email: req.user.email,
      code: +data.code,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verify-email')
  resendVerifyEmail(@Req() req) {
    this.logger.log('Handling resendVerifyEmail() request');
    return this.verificationsService.resendVerifyEmail(req.user.userId);
  }
}
