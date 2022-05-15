import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ReviewDto } from './dto/review.dto';
import { Review, ReviewDocument } from './schemes/review.scheme';
import { Product, ProductDocument } from '../products/schemes/product.scheme';
import { User, UserDocument } from '../users/schemes/user.scheme';
import { IReview } from './review.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: ReviewDto, userId: string): Promise<any> {
    const product = await this.productModel.findOne({
      slug: data.reviewObjectSlug,
    });

    const reviewToDB: IReview = {
      userId: userId,
      text: data.text,
      rating: data.rating,
    };

    if (!product.reviews) {
      const newObjectReview = {
        reviewObjectSlug: data.reviewObjectSlug,
        reviews: [reviewToDB],
      };

      const createdReview = await new this.reviewModel(newObjectReview).save();

      this.productModel.findOneAndUpdate(
        { slug: product.slug },
        { reviews: createdReview._id },
        { new: true },
      );

      return createdReview;
    }

    return this.reviewModel.findOneAndUpdate(
      { reviewObjectSlug: product.slug },
      { $push: { reviews: reviewToDB } },
      { new: true },
    );
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
