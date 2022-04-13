import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  Logger,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  private readonly logger = new Logger(ReviewsController.name);

  constructor(private reviewsService: ReviewsService) {}

  @Post('create')
  create(@Body() data: CreateReviewDto) {
    this.logger.log('Handling create() request...');
    return this.reviewsService.create(data);
  }

  @Get('list')
  read() {
    this.logger.log('Handling read() request...');
    return this.reviewsService.read();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateReviewDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.reviewsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.reviewsService.delete(id);
  }
}
