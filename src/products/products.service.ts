import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IProductFilter,
  IProductQuery,
  IProductRO,
  IProductsBySlugRO,
  IProductsRO,
} from './interfaces/product.interface';
import { Price, PriceDocument } from '../prices/schemes/price.scheme';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async getAllBySlug(query): Promise<IProductsBySlugRO> {
    const { slug }: IProductQuery = query;

    const find: IProductFilter = {};

    if (slug) find.slug = { $regex: `${slug}`, $options: 'i' };

    const products = await this.productModel
      .find(find)
      .select({ name: 1, slug: 1 })
      .exec();

    return { products };
  }

  async findAll(query): Promise<IProductsRO> {
    const {
      slug,
      minPrice = '0',
      maxPrice,
      sort,
      limit = '10',
      offset = '0',
      order,
      category,
      subCategory,
      brand,
      dietary,
    }: IProductQuery = query;
    // TODO: check sort key of SortEnum type?
    // TODO: check CategoryEnum item?
    const [{ products, total, highestPrice, lowestPrice }] =
      await this.productModel.aggregate([
        {
          $match: {
            // TODO: refactor to common methods (find, sort...). hearts performance
            category: category || /.*/,
            subCategory: subCategory || /.*/,
            'specifications.company': brand
              ? {
                  $regex: brand
                    .split('+')
                    .map((b) => b.replace(/-/g, ' '))
                    .join('|'),
                }
              : /.*/,
            slug: { $regex: `${slug ? slug : ''}`, $options: 'i' },
          },
        },
        {
          $lookup: {
            from: 'prices',
            localField: 'price',
            foreignField: '_id',
            as: 'price',
          },
        },
        { $unwind: '$price' },
        {
          $addFields: {
            sortPrice: {
              $cond: {
                if: '$price.discount_price',
                then: '$price.discount_price',
                else: '$price.price',
              },
            },
          },
        },
        {
          $match: {
            sortPrice: {
              $gte: minPrice ? +minPrice : 0, // TODO: replace 0 & 500 to dynamic value. It shoudl be highest and lowest product price. Values should appear on front even if no value received from start query
              $lte: maxPrice ? +maxPrice : 500,
            },
          },
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $addFields: {
            tags: {
              $arrayElemAt: ['$tags.tags', 0],
            },
          },
        },
        {
          $match: {
            'tags.dietaries': {
              // TODO: fix error when not existed tag in db. should return empty array
              $in: dietary ? dietary.split('+') : [null, /.*/],
            },
          },
        },
        { $sort: { [`${sort}`]: order === 'desc' ? 1 : -1 } },
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviews',
          },
        },
        { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
        {
          $facet: {
            products: [{ $skip: +offset }, { $limit: +limit }],
            total: [{ $count: 'total' }],
            highestPrice: [
              { $group: { _id: null, price: { $max: '$sortPrice' } } },
            ],
            lowestPrice: [
              { $group: { _id: null, price: { $min: '$sortPrice' } } },
            ],
          },
        },
      ]);

    const page: number = +limit !== 0 ? +offset / +limit + 1 : 1;
    const isLastPage =
      page * +limit === total[0].total || page * +limit > total[0].total;

    return {
      products,
      meta: {
        total: total[0].total,
        page,
        isLastPage,
        maxPrice: +highestPrice[0].price,
        minPrice: +lowestPrice[0].price,
      },
    };
  }

  async getQueryBrands(query): Promise<any> {
    const {
      slug,
      minPrice = '0',
      maxPrice,
      category,
      subCategory,
      brand,
    }: IProductQuery = query;
    const brands = await this.productModel.aggregate([
      {
        $match: {
          category: category || /.*/,
          subCategory: subCategory || /.*/,
          'specifications.company': brand
            ? {
                $regex: brand
                  .split('+')
                  .map((b) => b.replace(/-/g, ' '))
                  .join('|'),
              }
            : /.*/,
          slug: { $regex: `${slug ? slug : ''}`, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'price',
          foreignField: '_id',
          as: 'price',
        },
      },
      { $unwind: '$price' },
      {
        $addFields: {
          sortPrice: {
            $cond: {
              if: '$price.discount_price',
              then: '$price.discount_price',
              else: '$price.price',
            },
          },
        },
      },
      {
        $match: {
          sortPrice: {
            $gte: minPrice ? +minPrice : 0, // TODO: replace 0 & 500 to dynamic value. It shoudl be highest and lowest product price. Values should appear on front even if no value received from start query
            $lte: maxPrice ? +maxPrice : 500,
          },
        },
      },
      {
        $group: {
          _id: '$specifications.company',
          brand: { $addToSet: '$specifications.company' },
          popularity: {
            $sum: '$popularity',
          },
          quantity: { $sum: 1 },
        },
      },
      { $unwind: '$brand' },
    ]);

    return {
      brands,
    };
  }

  async getQueryPriceRange(query): Promise<any> {
    const {
      slug,
      minPrice = '0',
      maxPrice,
      category,
      subCategory,
      brand,
    }: IProductQuery = query;
    const res = await this.productModel.aggregate([
      {
        $match: {
          category: category || /.*/,
          subCategory: subCategory || /.*/,
          'specifications.company': brand
            ? {
                $regex: brand
                  .split('+')
                  .map((b) => b.replace(/-/g, ' '))
                  .join('|'),
              }
            : /.*/,
          slug: { $regex: `${slug ? slug : ''}`, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'price',
          foreignField: '_id',
          as: 'price',
        },
      },
      { $unwind: '$price' },
      {
        $addFields: {
          sortPrice: {
            $cond: {
              if: '$price.discount_price',
              then: '$price.discount_price',
              else: '$price.price',
            },
          },
        },
      },
      {
        $match: {
          sortPrice: {
            $gte: minPrice ? +minPrice : 0, // TODO: replace 0 & 500 to dynamic value. It shoudl be highest and lowest product price. Values should appear on front even if no value received from start query
            $lte: maxPrice ? +maxPrice : 500,
          },
        },
      },
      {
        $group: {
          _id: null,
          maxPrice: { $max: '$sortPrice' },
          minPrice: { $min: '$sortPrice' },
        },
      },
    ]);

    return {
      maxPrice: res[0].maxPrice,
      minPrice: res[0].minPrice,
    };
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
        select: 'tags',
        transform: (doc) => (doc === null ? null : doc.tags),
      })
      .exec();

    const newViews: UpdateProductDto = {
      views: product.views + 1,
    };

    await this.update(product.id, newViews);

    return { product };
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException(
        `Такого продукта не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.tags)
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
