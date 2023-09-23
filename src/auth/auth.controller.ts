import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginUserDto): Promise<any> {
    this.logger.log('Handling login() request...');
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() user: RegisterUserDto): Promise<any> {
    this.logger.log('Handling register() request...');
    return this.authService.register(user);
  }
}
