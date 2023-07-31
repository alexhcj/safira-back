import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HeroSlider,
  HeroSliderScheme,
  Promo,
  PromoScheme,
  Shop,
  ShopScheme,
  Special,
  SpecialScheme,
} from './schemes/offer.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HeroSlider.name, schema: HeroSliderScheme },
      { name: Promo.name, schema: PromoScheme },
      { name: Special.name, schema: SpecialScheme },
      { name: Shop.name, schema: ShopScheme },
    ]),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
