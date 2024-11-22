import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ValidatePasswordDto,
  VerifyNewEmailDto,
} from './dto/verification.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  changeEmail(@Req() req, @Body() data: ChangeEmailDto) {
    this.logger.log('Handling changeEmail() request');
    return this.verificationsService.changeEmail(req.user.userId, data.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-new-email')
  verifyNewEmail(@Req() req, @Body() data: VerifyNewEmailDto) {
    this.logger.log('Handling verifyNewEmail() request');
    return this.verificationsService.verifyNewEmail(req.user.userId, data.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  validatePassword(@Req() req, @Body() data: ValidatePasswordDto) {
    this.logger.log('Handling validatePassword() request');
    return this.verificationsService.validatePassword(
      req.user.email,
      data.password,
    );
  }
}
