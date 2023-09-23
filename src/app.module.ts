import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PricesModule } from './prices/prices.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { OffersModule } from './offers/offers.module';
import { CommentsModule } from './comments/comments.module';
import { VerificationsModule } from './verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}?retryWrites=true&w=majority`,
    ),
    ProductsModule,
    ReviewsModule,
    PostsModule,
    AuthModule,
    PricesModule,
    UsersModule,
    TagsModule,
    OffersModule,
    CommentsModule,
    VerificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
