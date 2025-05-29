import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Price, PriceDocument } from './schemes/price.scheme';
import { CreatePriceDto, UpdatePriceDto } from './dto/price.dto';
import { PriceRO } from './price.interface';

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {}

  async create(data: CreatePriceDto): Promise<PriceDocument> {
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

  public async update(id: string, data: UpdatePriceDto): Promise<Price> {
    const price = await this.priceModel.findById(id);

    if (!price) {
      throw new HttpException(`Price doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    const updatedPrice: UpdatePriceDto = {
      price: data.price,
      discount_price: data.discount_price,
    };

    return this.findByIdAndUpdate(new Types.ObjectId(id), updatedPrice);
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

  private async findByIdAndUpdate(
    id: Types.ObjectId,
    data: UpdatePriceDto,
  ): Promise<PriceDocument> {
    return this.priceModel.findByIdAndUpdate(id, data, { new: true });
  }
}
