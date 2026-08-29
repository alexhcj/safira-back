import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import {
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
} from '../common/cookies/refresh-cookie.constants';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {}

  @Post('login')
  async login(
    @Body() data: LoginUserDto,
    @Req() req,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('Handling login() request...');
    const { browser, os } = UAParser(req.headers['user-agent']);
    const clientId = `${browser.name} ${browser.major} / ${os.name} ${os.version}`;

    const { refreshToken, ...result } = await this.authService.login(
      data,
      clientId,
      ip,
    );
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    return result;
  }

  @Post('register')
  async register(@Body() data: RegisterUserDto, @Req() req, @Ip() ip: string) {
    this.logger.log('Handling register() request...');
    const { browser, os } = UAParser(req.headers['user-agent']);
    const clientId = `${browser.name} ${browser.major} / ${os.name} ${os.version}`;

    const { refreshToken, ...result } = await this.authService.register(
      data,
      clientId,
      ip,
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    this.logger.log('Handling me() request...');

    return this.authService.me(req.user.userId);
  }

  @Post('refresh')
  async refresh(
    @Req() req,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('Handling refresh() request...');
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!rawToken) throw new UnauthorizedException();

    const { browser, os } = UAParser(req.headers['user-agent']);
    const clientId = `${browser.name} ${browser.major} / ${os.name} ${os.version}`;

    const { accessToken, refreshToken, userId } =
      await this.authService.refresh(rawToken, clientId, ip);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

    return { id: userId, accessToken };
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.logger.log('Handling logout() request...');
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (rawToken) await this.sessionsService.revokeByRawToken(rawToken);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.logger.log('Handling logoutAll() request...');

    await this.sessionsService.revokeAllForUser(req.user.userId);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });

    return { success: true };
  }
}
