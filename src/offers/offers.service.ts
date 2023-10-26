import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemes/offer.scheme';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferEnum } from './enums/offer.enum';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { IOfferFilter, IOfferQuery } from './interfaces/offer.interface';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name)
    private offerModel: Model<OfferDocument>,
  ) {}

  async getAll({ type }: IOfferQuery): Promise<OfferDocument[]> {
    const searchType = type.includes('-')
      ? type.split('-').join('_').toUpperCase()
      : type.toUpperCase();
    const find: IOfferFilter = {};

    if (type) find.type = { $regex: `${searchType}`, $options: 'i' };

    return this.offerModel.find(find).populate({
      path: 'deal',
      populate: [
        { path: 'price' },
        { path: 'tags', transform: (doc) => doc.tags },
      ],
    });
  }

  async getOfferByType(type: OfferEnum): Promise<OfferDocument> {
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

  async create(data: CreateOfferDto): Promise<OfferDocument> {
    const newOffer: CreateOfferDto = {
      type: data.type,
      expiresDate: data.expiresDate,
      text: data.text,
      img: data.img,
      title: data.title,
      upTitle: data.upTitle,
      deal: data.deal,
      link: data.link
        ? {
            page: data.link.page,
            categoryType: data.link.categoryType,
            categoryValue: data.link.categoryValue,
          }
        : undefined,
    };

    const createdOffer = new this.offerModel(newOffer);
    return createdOffer.save();
  }

  async update(id: string, data: UpdateOfferDto): Promise<OfferDocument> {
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

  async byType(type: string): Promise<OfferDocument> {
    return this.offerModel.findOne({ type }).populate({
      path: 'deal',
      populate: [{ path: 'price' }, { path: 'tags' }],
    });
  }
}
