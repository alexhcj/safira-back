import {
  HttpException,
  HttpStatus,
  Injectable,
  ParamData,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(data);
    return createdProduct.save();
  }

  async read(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async readProduct(id: ParamData): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, data: CreateProductDto): Promise<Product> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException(
        `Такого продукта не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.productModel
      .findByIdAndUpdate(id, data)
      .setOptions({ new: true });
  }

  async delete(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException(
        `Такого продукта не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.productModel.findByIdAndDelete(id).exec();
  }
}
