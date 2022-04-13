import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/review.dto';
import { Review, ReviewDocument } from './schemes/review.scheme';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(data: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(data);
    return createdReview.save();
  }

  async read(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async update(id: string, data: CreateReviewDto): Promise<Review> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new HttpException(
        `Такого отзыва не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.reviewModel
      .findByIdAndUpdate(id, data)
      .setOptions({ new: true });
  }

  async delete(id: string) {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new HttpException(
        `Такого отзыва не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
