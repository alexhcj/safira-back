import { Body, Controller, Post } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { TestEmailDto } from './dto/emailer.dto';

@Controller('emailer')
export class EmailerController {
  constructor(private readonly emailerService: EmailerService) {}

  @Post('test')
  test(@Body() data: TestEmailDto) {
    return this.emailerService.example(data);
  }

  // @Post('test2')
  // test2(@Body() data: TestEmailDto) {
  //   return this.emailerService.example2(data);
  // }
}
