import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/product.dto';
import { IProductFilter, IProductRO, IProductsRO } from './product.interface';
import { Price, PriceDocument } from '../prices/schemes/price.scheme';
const slug = require('slug');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const newProduct = {
      slug: this.slugify(data.name),
      ...data,
    };
    const createdProduct = new this.productModel(newProduct);
    return createdProduct.save();
  }

  async getAll(query): Promise<IProductsRO> {
    const { filter, sort, limit } = query;
    const find: IProductFilter = {};

    if (filter) {
      const filters = JSON.parse(filter);

      if (filters.tags) {
        find.tags = filters.tags;
      }
    }

    const products = await this.productModel
      .find(find)
      .sort(sort)
      .limit(limit)
      .populate('price')
      .populate('reviews')
      .populate({
        path: 'tags',
        select: 'tag',
        transform: (doc) => (doc === null ? null : doc.tag),
      })
      .exec();

    const productsCount = products.length;

    return { products, productsCount };
  }

  async findOne(where): Promise<IProductRO> {
    const product = await this.productModel
      .findOne(where)
      .populate('price')
      .populate({
        path: 'reviews',
        populate: {
          path: 'comments.user',
          select: 'fullName',
        },
      })
      .populate({
        path: 'tags',
        select: 'tag',
        transform: (doc) => (doc === null ? null : doc.tag),
      })
      .exec();

    return { product };
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

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
