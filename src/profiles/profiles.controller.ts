import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profiles')
export class ProfilesController {
  private readonly logger = new Logger(ProfilesController.name);

  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  findByUserId(@Param('id') id: string) {
    this.logger.log('Handling findByUserId() request...');
    return this.profilesService.findByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req, @Body() data: UpdateProfileDto) {
    this.logger.log('Handling update() request...');
    return this.profilesService.update(req.user.userId, data);
  }
}
