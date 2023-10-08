import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private userService: UsersService) {}

  @Post()
  create(@Body() user: UserDto) {
    this.logger.log('Handling create() request');
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    this.logger.log('Handling findAll() request');
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    this.logger.log('Handling findAll() request');
    return this.userService.findById(id);
  }
}
