import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewScheme } from './schemes/review.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewScheme }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
