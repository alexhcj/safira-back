import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ReviewDto } from './dto/review.dto';
import { Review, ReviewDocument } from './schemes/review.scheme';
import { IReview } from './review.interface';
import { IReviewCreateRO } from './interfaces/review.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productService: ProductsService,
  ) {}

  async create(data: ReviewDto, userId: string): Promise<IReviewCreateRO> {
    const { product } = await this.productService.findBySlug(
      data.reviewProductSlug,
    );

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const reviewToDB: IReview = {
      user: new Types.ObjectId(userId),
      text: data.text,
      rating: data.rating,
    };

    if (!product.reviews) {
      const newObjectReview = {
        reviewProductSlug: data.reviewProductSlug,
        reviews: [reviewToDB],
      };

      const createdReview = await new this.reviewModel(newObjectReview).save();

      await this.productService.update(product.id, {
        reviews: createdReview._id,
      });

      return {
        status: HttpStatus.CREATED,
      };
    }

    await this.reviewModel.findOneAndUpdate(
      { reviewProductSlug: product.slug },
      { $push: { reviews: reviewToDB } },
      { new: true },
    );

    return {
      status: HttpStatus.CREATED,
    };
  }

  async read(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async update(id: string, data: ReviewDto): Promise<Review> {
    const review = await this.reviewModel.findById(id);

    if (!review) {
      throw new HttpException(
        `That review doesn't exist`,
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
        `That review doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
