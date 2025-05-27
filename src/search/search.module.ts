import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductScheme } from '../products/schemes/product.scheme';
import { Post, PostScheme } from '../posts/schemes/post.scheme';
import { ProductsService } from '../products/products.service';
import { PostsService } from '../posts/posts.service';
import { PricesService } from '../prices/prices.service';
import { Price, PriceScheme } from '../prices/schemes/price.scheme';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductScheme },
      { name: Post.name, schema: PostScheme },
      { name: Price.name, schema: PriceScheme },
    ]),
    TagsModule,
  ],
  controllers: [SearchController],
  providers: [SearchService, ProductsService, PostsService, PricesService],
})
export class SearchModule {}
