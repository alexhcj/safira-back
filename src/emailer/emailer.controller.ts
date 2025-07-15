import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { VerifyEmailDto } from './dto/emailer.dto';
import {
  CreateFeedbackDto,
  SubscribeUserDto,
  UnsubscribeUserDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emailer')
export class EmailerController {
  private readonly logger = new Logger(EmailerController.name);

  constructor(private readonly emailerService: EmailerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findSubscription(@Req() req) {
    this.logger.log('Handling findSubscription() request...');
    return this.emailerService.findSubscription(req.user.userId);
  }

  @Post('send-verify-email')
  sendVerifyEmail(@Body() data: VerifyEmailDto) {
    this.logger.log('Handling sendVerifyEmail() request...');
    return this.emailerService.sendVerifyEmail(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe-user')
  subscribeUser(@Req() req, @Body() data: SubscribeUserDto) {
    this.logger.log('Handling subscribeUser() request...');
    return this.emailerService.subscribeUser(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-subscription')
  updateSubscription(@Req() req, @Body() data: UpdateSubscriptionDto) {
    this.logger.log('Handling updateSubscription() request...');
    return this.emailerService.updateSubscription(req.user.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('unsubscribe')
  unsubscribeUser(@Req() req, @Body() data: UnsubscribeUserDto) {
    this.logger.log('Handling unsubscribeUser() request...');
    return this.emailerService.unsubscribeUser(req.user.userId, data);
  }

  @Get('send-most-popular-products')
  sendMostPopularProducts(@Body() data: any) {
    this.logger.log('Handling sendMostPopularProducts() request...');
    return this.emailerService.sendMostPopularProducts(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-feedback')
  sendFeedback(@Req() req, @Body() data: CreateFeedbackDto) {
    this.logger.log('Handling sendFeedback() request...');
    return this.emailerService.sendFeedback(req.user.userId, data);
  }
}
