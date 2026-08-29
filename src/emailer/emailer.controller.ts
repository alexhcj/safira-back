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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ICurrentUser } from '../common/interfaces/current-user.interface';

@Controller('emailer')
export class EmailerController {
  private readonly logger = new Logger(EmailerController.name);

  constructor(private readonly emailerService: EmailerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findSubscription(@CurrentUser('id') id: string) {
    this.logger.log('Handling findSubscription() request...');
    return this.emailerService.findSubscription(id);
  }

  @Post('send-verify-email')
  sendVerifyEmail(@Body() data: VerifyEmailDto) {
    this.logger.log('Handling sendVerifyEmail() request...');
    return this.emailerService.sendVerifyEmail(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe-user')
  subscribeUser(@CurrentUser('id') id: string, @Body() data: SubscribeUserDto) {
    this.logger.log('Handling subscribeUser() request...');
    return this.emailerService.subscribeUser(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-subscription')
  updateSubscription(
    @CurrentUser() user: ICurrentUser,
    @Body() data: UpdateSubscriptionDto,
  ) {
    this.logger.log('Handling updateSubscription() request...');
    return this.emailerService.updateSubscription(user.email, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('unsubscribe')
  unsubscribeUser(
    @CurrentUser('id') id: string,
    @Body() data: UnsubscribeUserDto,
  ) {
    this.logger.log('Handling unsubscribeUser() request...');
    return this.emailerService.unsubscribeUser(id, data);
  }

  @Get('send-most-popular-products')
  sendMostPopularProducts(@Body() data: any) {
    this.logger.log('Handling sendMostPopularProducts() request...');
    return this.emailerService.sendMostPopularProducts(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-feedback')
  sendFeedback(@CurrentUser('id') id: string, @Body() data: CreateFeedbackDto) {
    this.logger.log('Handling sendFeedback() request...');
    return this.emailerService.sendFeedback(id, data);
  }
}
