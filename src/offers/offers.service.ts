import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HeroSlider,
  HeroSliderDocument,
  Promo,
  PromoDocument,
  Shop,
  ShopDocument,
  Special,
  SpecialDocument,
} from './schemes/offer.scheme';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferEnum } from './enums/offer.enum';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(HeroSlider.name)
    private offerModel: Model<
      HeroSliderDocument | PromoDocument | SpecialDocument | ShopDocument
    >,
  ) {}

  async getOfferByType(
    type: OfferEnum,
  ): Promise<HeroSlider | Promo | Special | Shop> {
    const searchType = type.includes('-')
      ? type.split('-').join('_').toUpperCase()
      : type.toUpperCase();
    const offer = await this.byType(searchType);

    if (!offer)
      throw new HttpException(
        'This offer doen`t exists',
        HttpStatus.BAD_REQUEST,
      );

    return offer;
  }

  async create(
    data: CreateOfferDto,
  ): Promise<HeroSlider | Promo | Special | Shop> {
    const newOffer: CreateOfferDto = {
      type: data.type,
      text: data.text,
      img: data.img,
    };

    if (data.title) newOffer.title = data.title;
    if (data.upTitle) newOffer.upTitle = data.upTitle;

    const createdOffer = new this.offerModel(newOffer);
    return createdOffer.save();
  }

  async update(
    id: string,
    data: UpdateOfferDto,
  ): Promise<HeroSlider | Promo | Special | Shop> {
    const offer = await this.offerModel.findById(id);

    if (!offer)
      throw new HttpException(
        'This offer doesn`t exists',
        HttpStatus.BAD_REQUEST,
      );

    const newOffer: UpdateOfferDto = {};

    if (data.title) newOffer.title = data.title;
    if (data.upTitle) newOffer.upTitle = data.upTitle;
    if (data.text) newOffer.text = data.text;
    if (data.img) newOffer.img = data.img;

    return this.offerModel
      .findByIdAndUpdate(id, newOffer)
      .setOptions({ new: true });
  }

  async byType(type: string): Promise<HeroSlider | Promo | Special | Shop> {
    return this.offerModel.findOne({ type });
  }
}
