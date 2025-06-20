import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IProduct,
  IProductFilter,
  IProductQuery,
  IProductRelatedQuery,
  IProductRO,
  IProductsBySlugRO,
  IProductsRO,
} from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { PricesService } from '../prices/prices.service';
import { TagsService } from '../tags/tags.service';
import { TagTypeEnum } from '../tags/enum/tag-type.enum';
import { slugify, toSlug } from '../common/utils';
import { FindQueryDietaryTagsRdo } from './dto/find-query-dietary-tags.rdo';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly pricesService: PricesService,
    private readonly tagsService: TagsService,
  ) {}

  async create(data: CreateProductDto): Promise<ProductDocument> {
    const priceDocument = await this.pricesService.create(data.price);

    if (!priceDocument._id)
      throw new HttpException(
        'Price was not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const tagsDocument =
      data.tags &&
      (await this.tagsService.create({
        type: TagTypeEnum.PRODUCT,
        tags: data.tags,
      }));

    if (data.tags && !tagsDocument)
      throw new HttpException(
        'Tag was not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const newProduct: IProduct = {
      name: data.name,
      slug: slugify(data.name),
      price: priceDocument._id,
      description: data.description,
      primeCategory: data.primeCategory
        ? toSlug(data.primeCategory)
        : undefined,
      subCategory: data.subCategory ? toSlug(data.subCategory) : undefined,
      basicCategory: data.basicCategory
        ? toSlug(data.basicCategory)
        : undefined,
      popularity: data.popularity,
      views: data.views,
      tags: (data.tags && tagsDocument._id) || undefined,
      specifications: {
        company: {
          displayName: data.specifications.company,
          slug: slugify(data.specifications.company),
          normalizedName: this.normalizeCompanyName(
            data.specifications.company,
          ),
        },
        shelfLife: data.specifications.shelfLife,
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

    const brandFilter = brand
      ? {
          $or: [
            // Match by slug (most efficient)
            {
              'specifications.company.slug': {
                $in: brand.split('+'),
              },
            },
            // Fallback to normalized name search if needed
            {
              'specifications.company.normalizedName': {
                $regex: brand
                  .split('+')
                  .map((b) => this.normalizeCompanyName(b.replace(/-/g, ' ')))
                  .join('|'),
              },
            },
          ],
        }
      : {};

    const [{ products, total, highestPrice, lowestPrice }] =
      await this.productModel.aggregate([
        {
          $match: {
            primeCategory: primeCategory || /.*/,
            subCategory: subCategory || /.*/,
            basicCategory: basicCategory || /.*/,
            ...brandFilter,
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
              $gte: minPrice ? +minPrice : 0,
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

  async findRelated(query: IProductRelatedQuery): Promise<ProductDocument[]> {
    const { limit = 10, slug } = query;
    const product = await this.findBySlug(slug);

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const { name, description, basicCategory, subCategory } = product.product;

    const searchTerms = `${name} ${description} ${basicCategory} ${subCategory}`;

    return this.productModel
      .aggregate([
        {
          $search: {
            index: 'text',
            text: {
              query: searchTerms,
              path: ['name', 'description', 'basicCategory', 'subCategory'],
            },
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
        { $match: { name: { $ne: name } } },
        { $limit: +limit },
      ])
      .exec();
  }

  public async findTopTenPopular(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ views: -1 }).limit(10).lean().exec();
  }

  async findRandom({ size = 1 }): Promise<Aggregate<ProductDocument[]>> {
    return this.productModel.aggregate([{ $sample: { size } }]);
  }

  async findQueryDietaryTags(query): Promise<FindQueryDietaryTagsRdo> {
    const {
      slug,
      minPrice = '0',
      maxPrice,
      primeCategory,
      subCategory,
      basicCategory,
      brand,
    }: IProductQuery = query;

    const brandFilter = brand
      ? {
          'specifications.company.slug': {
            $in: brand.split('+'),
          },
        }
      : {};

    const tags = await this.productModel.aggregate([
      {
        $match: {
          primeCategory: primeCategory || /.*/,
          subCategory: subCategory || /.*/,
          basicCategory: basicCategory || /.*/,
          ...brandFilter,
          slug: { $regex: slug || '', $options: 'i' },
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
            $gte: +minPrice,
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
        $unwind: '$tags',
      },
      {
        $unwind: '$tags.tags.dietaries',
      },
      {
        $group: {
          _id: null,
          uniqueDietaries: { $addToSet: '$tags.tags.dietaries' },
        },
      },
      {
        $project: {
          _id: 0,
          uniqueDietaries: 1,
        },
      },
    ]);

    return tags[0]?.uniqueDietaries || [];
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

    const brandFilter = brand
      ? {
          'specifications.company.slug': {
            $in: brand.split('+'),
          },
        }
      : {};

    const brands = await this.productModel.aggregate([
      {
        $match: {
          primeCategory: primeCategory || /.*/,
          subCategory: subCategory || /.*/,
          basicCategory: basicCategory || /.*/,
          ...brandFilter,
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
            $gte: minPrice ? +minPrice : 0,
            $lte: maxPrice ? +maxPrice : 500,
          },
        },
      },
      {
        $group: {
          _id: '$specifications.company',
          brand: { $first: '$specifications.company' },
          popularity: {
            $sum: '$popularity',
          },
          quantity: { $sum: 1 },
          firstProductName: { $first: '$name' }, // Product name as a secondary sort key
        },
      },
      { $sort: { popularity: -1, 'brand.displayName': 1 } }, // alphabetical sort as a tie-breaker
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

    const brandFilter = brand
      ? {
          'specifications.company.slug': {
            $in: brand.split('+'),
          },
        }
      : {};

    const res = await this.productModel.aggregate([
      {
        $match: {
          primeCategory: primeCategory || /.*/,
          subCategory: subCategory || /.*/,
          basicCategory: basicCategory || /.*/,
          ...brandFilter,
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
            $gte: minPrice ? +minPrice : 0,
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

  // IBrandsRO[]
  async findAllBrands(): Promise<any> {
    return this.productModel.aggregate([
      {
        $group: {
          _id: {
            firstLetter: {
              $substr: ['$specifications.company.displayName', 0, 1],
            },
          },
          brands: {
            $addToSet: {
              slug: '$specifications.company.slug',
              displayName: '$specifications.company.displayName',
            },
          },
        },
      },
      {
        $sort: { '_id.firstLetter': 1 },
      },
      {
        $project: {
          name: { $toUpper: '$_id.firstLetter' },
          _id: 0,
          brands: {
            $sortArray: {
              input: '$brands',
              sortBy: 1,
            },
          },
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
        company: data.specifications?.company
          ? {
              displayName:
                data.specifications.company.displayName ||
                product.specifications.company.displayName,
              slug:
                data.specifications.company.slug ||
                slugify(data.specifications.company.displayName),
              normalizedName:
                data.specifications.company.normalizedName ||
                this.normalizeCompanyName(
                  data.specifications.company.displayName,
                ),
            }
          : product.specifications.company,
        producingCountry: data.specifications
          ? data.specifications.producingCountry
          : product.specifications.producingCountry ??
            data.specifications.company.displayName,
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

  private normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
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
