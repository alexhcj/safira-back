import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferScheme } from './schemes/offer.scheme';
import { Product, ProductScheme } from '../products/schemes/product.scheme';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Offer.name,
        schema: OfferScheme,
      },
      {
        name: Product.name,
        schema: ProductScheme,
      },
    ]),
    ProductsModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
