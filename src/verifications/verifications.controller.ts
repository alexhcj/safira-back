import {
  Body,
  Controller,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ResendVerifyEmailDto,
  ResetPasswordDto,
  ValidatePasswordDto,
  VerifyCodeDto,
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
  resendVerifyEmail(@Req() req, @Body() data: ResendVerifyEmailDto) {
    this.logger.log('Handling resendVerifyEmail() request');
    return this.verificationsService.resendVerifyEmail(
      data.type,
      req.user.userId,
    );
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

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Req() req, @Body() data: ChangePasswordDto) {
    this.logger.log('Handling changePassword() request');
    return this.verificationsService.changePassword(
      req.user.userId,
      data.email,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-code')
  verifyCode(@Req() req, @Ip() ip, @Body() data: VerifyCodeDto) {
    this.logger.log('Handling verifyCode() request');
    return this.verificationsService.verifyCode(
      req.user.userId,
      ip,
      req.headers['user-agent'],
      req.user.email,
      data.code,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(
    @Req() req,
    @Query() query,
    @Ip() ip,
    @Body() data: ResetPasswordDto,
  ) {
    this.logger.log('Handling resetPassword() request');
    return this.verificationsService.resetPassword(
      query.userId,
      +query.expirationTime,
      query.token,
      ip,
      req.headers['user-agent'],
      req.user.email,
      data,
    );
  }
}
