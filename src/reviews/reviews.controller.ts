import {
  Get,
  Put,
  Req,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  Logger,
} from '@nestjs/common';
import { ReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(private reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() data: ReviewDto, @Req() req: any) {
    this.logger.log('Handling create() request...');
    return this.reviewsService.create(data, req.user.userId);
  }

  @Get('list')
  read() {
    this.logger.log('Handling read() request...');
    return this.reviewsService.read();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: ReviewDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.reviewsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.reviewsService.delete(id);
  }
}
