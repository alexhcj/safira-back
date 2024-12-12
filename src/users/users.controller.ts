import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('find-profile')
  findProfile(@Req() req) {
    this.logger.log('Handling findProfile() request');
    return this.userService.findProfile(req.user.userId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    this.logger.log('Handling findAll() request');
    return this.userService.findById(id);
  }

  // ADMIN
  @Get('/by-id-with-profile/:id')
  findByIdWithProfile(@Param('id') id: string) {
    this.logger.log('Handling findByIdWithProfile() request');
    return this.userService.findByIdWithProfile(id);
  }

  @Get('/by-email-with-profile/:email')
  findByEmailWithProfile(@Param('email') email: string) {
    this.logger.log('Handling findByEmailWithProfile() request');
    return this.userService.findByEmailWithProfile(email);
  }
}
