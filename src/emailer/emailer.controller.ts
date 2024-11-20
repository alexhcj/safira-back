import { Body, Controller, Post } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { VerifyEmailDto } from './dto/emailer.dto';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Post('send-verify-email')
  sendVerifyEmail(@Body() data: VerifyEmailDto) {
    return this.emailerService.sendVerifyEmail(data);
  }
}
