import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Price, PriceDocument } from './schemes/price.scheme';
import { CreatePriceDto } from './dto/price.dto';
import { PriceRO } from './price.interface';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {}

  async create(data: CreatePriceDto): Promise<Price> {
    const createdPrice = new this.priceModel(data);
    return createdPrice.save();
  }

  async findAll(): Promise<Price[]> {
    return this.priceModel.find().exec();
  }

  async findOne(where): Promise<PriceRO> {
    const price = await this.priceModel.findOne(where).populate('price').exec();
    return { price };
  }

  async update(id: string, data: CreatePriceDto): Promise<Price> {
    const price = await this.priceModel.findById(id);

    if (!price) {
      throw new HttpException(
        `Такой цены не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.priceModel
      .findByIdAndUpdate(id, data)
      .setOptions({ new: true });
  }

  async delete(id: string) {
    const price = await this.priceModel.findById(id);

    if (!price) {
      throw new HttpException(
        `Такой цены не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.priceModel.findByIdAndDelete(id).exec();
  }
}
