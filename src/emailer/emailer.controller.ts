import {
  Body,
  Controller,
  Delete,
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
  SubscribeUserDto,
  UnsubscribeUserDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('emailer')
export class EmailerController {
  private readonly logger = new Logger(EmailerController.name);

  constructor(private readonly emailerService: EmailerService) {}

  @Post('send-verify-email')
  sendVerifyEmail(@Body() data: VerifyEmailDto) {
    this.logger.log('Handling sendVerifyEmail() request...');
    return this.emailerService.sendVerifyEmail(data);
  }

  @Post('subscribe-user')
  subscribeUser(@Body() data: SubscribeUserDto) {
    this.logger.log('Handling subscribeUser() request...');
    return this.emailerService.subscribeUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-subscription')
  updateSubscription(@Req() req, @Body() data: UpdateSubscriptionDto) {
    this.logger.log('Handling updateSubscription() request...');
    return this.emailerService.updateSubscription(req.user.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unsubscribe-user')
  unsubscribeUser(@Req() req, @Body() data: UnsubscribeUserDto) {
    this.logger.log('Handling unsubscribeUser() request...');
    return this.emailerService.unsubscribeUser(req.user.userId, data);
  }

  @Get('send-most-popular-products')
  sendMostPopularProducts(@Body() data: any) {
    this.logger.log('Handling sendMostPopularProducts() request...');
    return this.emailerService.sendMostPopularProducts(data);
  }
}
