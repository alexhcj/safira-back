import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { validationSchema } from './config/validation';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.database.connectionString'),
        dbName: configService.get<string>('mongodb.database.databaseName'),
      }),
      inject: [ConfigService],
    }),
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
