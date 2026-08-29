import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { Response } from 'express';
import { VerificationsService } from './verifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ChangeEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResendVerifyEmailDto,
  ResetForgotPasswordDto,
  ResetPasswordDto,
  ValidatePasswordDto,
  VerifyCodeDto,
  VerifyNewEmailDto,
} from './dto/verification.dto';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
} from '../common/cookies/refresh-cookie.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ICurrentUser } from '../common/interfaces/current-user.interface';

@Controller('verifications')
export class VerificationsController {
  private readonly logger = new Logger(VerificationsController.name);

  constructor(private verificationsService: VerificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(
    @CurrentUser() user: ICurrentUser,
    @Body() data: { code: string },
  ) {
    this.logger.log('Handling verifyEmail() request');
    return this.verificationsService.verifyEmail({
      userId: user.id,
      email: user.email,
      code: +data.code,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend-verify-email')
  resendVerifyEmail(
    @CurrentUser('id') id: string,
    @Body() data: ResendVerifyEmailDto,
  ) {
    this.logger.log('Handling resendVerifyEmail() request');
    return this.verificationsService.resendVerifyEmail(data.type, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  changeEmail(@CurrentUser('id') id: string, @Body() data: ChangeEmailDto) {
    this.logger.log('Handling changeEmail() request');
    return this.verificationsService.changeEmail(id, data.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-new-email')
  verifyNewEmail(
    @CurrentUser('id') id: string,
    @Body() data: VerifyNewEmailDto,
  ) {
    this.logger.log('Handling verifyNewEmail() request');
    return this.verificationsService.verifyNewEmail(id, data.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  async validatePassword(
    @Req() req,
    @CurrentUser() user: ICurrentUser,
    @Ip() ip: string,
    @Body() data: ValidatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('Handling validatePassword() request');

    const { browser, os } = UAParser(req.headers['user-agent']);
    const clientId = `${browser.name} ${browser.major} / ${os.name} ${os.version}`;

    const { refreshToken, ...result } =
      await this.verificationsService.validatePassword(
        user.email,
        data.password,
        clientId,
        ip,
      );

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() req,
    @CurrentUser('id') id: string,
    @Body() data: ChangePasswordDto,
  ) {
    this.logger.log('Handling changePassword() request');

    const { browser, os } = UAParser(req.headers['user-agent']);

    return this.verificationsService.changePassword(
      id,
      data.email,
      `${browser.name} ${browser.major}`,
      `${os.name} ${os.version}`,
    );
  }

  @Post('forgot-password')
  forgotPassword(@Req() req, @Ip() ip, @Body() data: ForgotPasswordDto) {
    this.logger.log('Handling forgotPassword() request');

    const { browser, os } = UAParser(req.headers['user-agent']);

    return this.verificationsService.forgotPassword(
      data.email,
      ip,
      `${browser.name} ${browser.major}`,
      `${os.name} ${os.version}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-code')
  verifyCode(
    @Req() req,
    @CurrentUser() user: ICurrentUser,
    @Ip() ip,
    @Body() data: VerifyCodeDto,
  ) {
    this.logger.log('Handling verifyCode() request');

    const { browser, os } = UAParser(req.headers['user-agent']);

    return this.verificationsService.verifyCode(
      user.id,
      ip,
      `${browser.name} ${browser.major}`,
      `${os.name} ${os.version}`,
      user.email,
      data.code,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  resetPassword(
    @Req() req,
    @CurrentUser() user: ICurrentUser,
    @Query() query,
    @Ip() ip,
    @Body() data: ResetPasswordDto,
  ) {
    this.logger.log('Handling resetPassword() request');

    const { browser, os } = UAParser(req.headers['user-agent']);

    return this.verificationsService.resetPassword(
      user.id,
      query.userId,
      +query.expirationTime,
      query.token,
      ip,
      `${browser.name} ${browser.major}`,
      `${os.name} ${os.version}`,
      user.email,
      data,
    );
  }

  @Post('reset-forgot-password')
  resetForgotPassword(
    @Req() req,
    @Query() query,
    @Ip() ip,
    @Body() data: ResetForgotPasswordDto,
  ) {
    this.logger.log('Handling resetForgotPassword() request');

    const { browser, os } = UAParser(req.headers['user-agent']);

    return this.verificationsService.resetForgotPassword(
      query.userId,
      +query.expirationTime,
      query.token,
      ip,
      `${browser.name} ${browser.major}`,
      `${os.name} ${os.version}`,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('email-status')
  async getEmailStatus(@CurrentUser('id') id: string) {
    this.logger.log('Handling getEmailStatus() request');
    return this.verificationsService.isUserEmailVerified(id);
  }
}
