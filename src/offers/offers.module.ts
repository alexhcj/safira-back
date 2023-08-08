import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferScheme } from './schemes/offer.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offer.name, schema: OfferScheme }]),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
