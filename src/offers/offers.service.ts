import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemes/offer.scheme';
import { OfferDto } from './dto/offer.dto';
import { OfferEnum } from './enums/offer.enum';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async getOfferByType(type: OfferEnum): Promise<Offer> {
    const offer = await this.byType(type.toUpperCase());

    if (!offer)
      throw new HttpException(
        'This offer doen`t exists',
        HttpStatus.BAD_REQUEST,
      );

    return offer;
  }

  async create(data: OfferDto): Promise<Offer> {
    const offer = await this.byType(data.type);

    if (offer) throw new Error('This offer already exists');

    const newOffer: OfferDto = {
      type: data.type,
      img: data.img,
      description: data.description,
    };

    const createdOffer = new this.offerModel(newOffer);
    return createdOffer.save();
  }

  async update(id: string, data: OfferDto): Promise<Offer> {
    const offer = await this.offerModel.findById(id);

    if (!offer)
      throw new HttpException(
        'This offer doesn`t exists',
        HttpStatus.BAD_REQUEST,
      );

    const newOffer: OfferDto = {
      type: data.type,
      img: data.img,
      description: data.description,
    };

    return this.offerModel
      .findByIdAndUpdate(id, newOffer)
      .setOptions({ new: true });
  }

  async byType(type: string): Promise<Offer> {
    return this.offerModel.findOne({ type });
  }
}
