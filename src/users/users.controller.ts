import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private userService: UsersService) {}

  @Post('create')
  create(@Body() user: UserDto) {
    this.logger.log('Handling create() request');
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    this.logger.log('Handling findAll() request');
    return this.userService.findAll();
  }
}
