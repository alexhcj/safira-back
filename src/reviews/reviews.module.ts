import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewScheme } from './schemes/review.scheme';
import { Product, ProductScheme } from '../products/schemes/product.scheme';
import { User, UserScheme } from '../users/schemes/user.scheme';
import { ProductsService } from '../products/products.service';
import { Price, PriceScheme } from '../prices/schemes/price.scheme';
import { PricesService } from '../prices/prices.service';
import { TagsModule } from '../tags/tags.module';
import { BrandsModule } from '../brands/brands.module';
import { Brand, BrandSchema } from '../brands/schemes/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewScheme }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductScheme }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserScheme }]),
    MongooseModule.forFeature([
      { name: Price.name, schema: PriceScheme },
      { name: Brand.name, schema: BrandSchema },
    ]),
    TagsModule,
    BrandsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ProductsService, PricesService],
})
export class ReviewsModule {}
