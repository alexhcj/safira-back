import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IBrandsRO,
  IProduct,
  IProductFilter,
  IProductQuery,
  IProductRO,
  IProductsBySlugRO,
  IProductsRO,
} from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { PricesService } from '../prices/prices.service';

const slug = require('slug');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly pricesService: PricesService,
  ) {}

  async create(data: CreateProductDto): Promise<ProductDocument> {
    const { _id } = await this.pricesService.create(data.price);

    if (!_id)
      throw new HttpException(
        'Price was not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const newProduct: IProduct = {
      name: data.name,
      slug: this.slugify(data.name),
      price: _id,
      description: data.description,
      primeCategory: data.primeCategory,
      subCategory: data.subCategory,
      basicCategory: data.basicCategory,
      popularity: data.popularity,
      views: data.views,
      tags: data.tags.map((tag) => new Types.ObjectId(tag)),
      specifications: {
        company: data.specifications.company,
        shelfLife: new Date(data.specifications.shelfLife),
        quantity: data.specifications.quantity,
        producingCountry: data.specifications.producingCountry,
      },
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
      primeCategory,
      subCategory,
      basicCategory,
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
            primeCategory: primeCategory || /.*/, // TODO: refactor to combined query with types
            subCategory: subCategory || /.*/,
            basicCategory: basicCategory || /.*/,
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

    if (products.length === 0) {
      return {
        products: [],
        meta: {
          total: 0,
          page: 0,
          isLastPage: null,
          maxPrice: 0,
          minPrice: 0,
        },
      };
    }

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

  public async findTopTenPopular(): Promise<ProductDocument[]> {
    // TODO: change to popularity (buy countes)
    return this.productModel.find().sort({ views: -1 }).limit(10).lean().exec();
  }

  async findRandom({ size = 1 }): Promise<Aggregate<ProductDocument[]>> {
    return this.productModel.aggregate([{ $sample: { size } }]);
  }

  async getQueryBrands(query): Promise<any> {
    const {
      slug,
      minPrice = '0',
      maxPrice,
      primeCategory,
      subCategory,
      basicCategory,
      brand,
    }: IProductQuery = query;
    const brands = await this.productModel.aggregate([
      {
        $match: {
          primeCategory: primeCategory || /.*/,
          subCategory: subCategory || /.*/,
          basicCategory: basicCategory || /.*/,
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
      primeCategory,
      subCategory,
      basicCategory,
      brand,
    }: IProductQuery = query;
    const res = await this.productModel.aggregate([
      {
        $match: {
          primeCategory: primeCategory || /.*/, // TODO: refactor
          subCategory: subCategory || /.*/,
          basicCategory: basicCategory || /.*/,
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

    if (res.length === 0) {
      return {
        maxPrice: 0,
        minPrice: 0,
      };
    }

    return {
      maxPrice: res[0].maxPrice,
      minPrice: res[0].minPrice,
    };
  }

  public async findBySlug(slug: string): Promise<IProductRO> {
    const product = await this.productModel
      .findOne({ slug })
      .populate('price')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviews.user',
          foreignField: 'userId',
          select: 'firstName avatarId -userId',
        },
      })
      .populate({
        path: 'tags',
        select: 'tags',
        transform: (doc) => (doc === null ? null : doc.tags),
      })
      .exec();

    const newViews: UpdateProductDto = {
      views: (product.views ? product.views : 0) + 1,
    };

    if (product.reviews) {
      const totalRating = product.reviews.reviews.reduce(
        (acc, cur) => acc + +cur.rating,
        0,
      );
      const reviewsLength = product.reviews.reviews.length;

      product.rating = totalRating / reviewsLength;
    }

    await this.update(product.id, newViews);

    return { product };
  }

  async findAllBrands(): Promise<IBrandsRO[]> {
    return this.productModel.aggregate([
      {
        $group: {
          _id: {
            company: { $substr: ['$specifications.company', 0, 1] },
          },
          brands: {
            $addToSet: '$specifications.company',
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          name: '$_id.company',
          _id: 0,
          brands: 1,
        },
      },
    ]);
  }

  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const product = await this.findById(new Types.ObjectId(id));

    if (!product) {
      throw new HttpException(`Product doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    if (data.price)
      await this.pricesService.update(product.price._id, data.price);

    const updatedProduct: UpdateProductDto = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      primeCategory: data.primeCategory,
      subCategory: data.subCategory,
      basicCategory: data.basicCategory,
      popularity: data.popularity,
      views: data.views,
      tags: data.tags,
      reviews: data.reviews,
      specifications: {
        company: data.specifications
          ? data.specifications.company
          : product.specifications.company,
        producingCountry: data.specifications
          ? data.specifications.producingCountry
          : product.specifications.company,
        quantity: data.specifications
          ? data.specifications.quantity
          : product.specifications.quantity,
        shelfLife: data.specifications
          ? data.specifications.shelfLife
          : product.specifications.shelfLife,
      },
    };

    return this.productModel
      .findByIdAndUpdate(id, updatedProduct)
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

  private async findById(id: Types.ObjectId): Promise<ProductDocument> {
    return this.productModel
      .findById(id)
      .populate('price')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviews.user',
          foreignField: 'userId',
          select: 'firstName avatarId -userId',
        },
      })
      .populate({
        path: 'tags',
        select: 'tags',
        transform: (doc) => (doc === null ? null : doc.tags),
      })
      .exec();
  }
}
