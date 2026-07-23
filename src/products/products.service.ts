import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemes/product.scheme';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IBrandsRO,
  ICreateProduct,
  IProduct,
  IProductFilter,
  IProductQuery,
  IProductRaw,
  IProductRelatedQuery,
  IProductRO,
  IProductsBySlugRO,
  IProductsRawRO,
  IProductsRO,
} from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { PricesService } from '../prices/prices.service';
import { TagsService } from '../tags/tags.service';
import { TagTypeEnum } from '../tags/enum/tag-type.enum';
import { slugify } from '../common/utils';
import { FindQueryDietaryTagsRdo } from './dto/find-query-dietary-tags.rdo';
import { slugifySearch } from '../helpers';

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

    const newProduct: ICreateProduct = {
      name: data.name,
      slug: slugify(data.name),
      price: priceDocument._id,
      description: data.description,
      primeCategory: data.primeCategory,
      subCategory: data.subCategory,
      basicCategory: data.basicCategory,
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

  public async findAllClient(query: IProductQuery): Promise<IProductsRO> {
    const productsData = await this.findAll(query);

    const transformedProducts: IProduct[] = productsData.products.map(
      this.toClientProduct,
    );

    return {
      products: transformedProducts,
      meta: productsData.meta,
    };
  }

  public async findAllServer(query: IProductQuery): Promise<IProductsRawRO> {
    const productsData = await this.findAll(query);

    const transformedProducts = productsData.products.map(this.toServerProduct);

    return {
      products: transformedProducts,
      meta: productsData.meta,
    };
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
            from: 'categories',
            let: { categorySlug: '$primeCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'prime'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'primeCategory',
          },
        },
        {
          $unwind: { path: '$primeCategory', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'categories',
            let: { categorySlug: '$subCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'sub'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'subCategory',
          },
        },
        { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'categories',
            let: { categorySlug: '$basicCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'basic'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'basicCategory',
          },
        },
        {
          $unwind: { path: '$basicCategory', preserveNullAndEmptyArrays: true },
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
        {
          $unset: [
            '_id',
            'createdAt',
            'updatedAt',
            'price._id',
            'price.createdAt',
            'price.updatedAt',
          ],
        },
      ])
      .exec();
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
              if: '$price.discountPrice',
              then: '$price.discountPrice',
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
      dietary,
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
              if: '$price.discountPrice',
              then: '$price.discountPrice',
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
        $match: dietary
          ? {
              'tags.dietaries': {
                $in: dietary.split('+'),
              },
            }
          : {},
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
      dietary,
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
              if: '$price.discountPrice',
              then: '$price.discountPrice',
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
        $match: dietary
          ? {
              'tags.dietaries': {
                $in: dietary.split('+'),
              },
            }
          : {},
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

  /**
   * Fetches a single product by slug for the product detail page.
   *
   * Converted from find().populate() to aggregate() so the same
   * category-name $lookup used in findAll() applies here too - the
   * populate() chain couldn't do a slug+type filtered join, which is why
   * primeCategory/subCategory need aggregate rather than a plain populate.
   *
   * Schema notes for the reviews join:
   *  - `reviews` on Product is a single ref to a `Reviews` document.
   *  - That document has an embedded `reviews` array; each item's `user`
   *    field is a standard ObjectId ref to `Profile` (confirmed against
   *    review.scheme.ts), matched here on `_id` like any Mongoose ref -
   *    NOT on a `userId` field, which doesn't exist on either schema.
   *  - `firstName`/`avatarId` are assumed to live on `Profile`; flag if
   *    that's wrong once profile.scheme.ts is available.
   */
  public async findBySlug(slug: string): Promise<IProductRO> {
    const [product] = await this.productModel.aggregate([
      { $match: { slug } },
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
      { $addFields: { tags: { $arrayElemAt: ['$tags.tags', 0] } } },
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
        $lookup: {
          from: 'profiles',
          localField: 'reviews.reviews.user',
          foreignField: '_id',
          as: 'reviewProfiles',
        },
      },
      {
        $addFields: {
          'reviews.reviews': {
            $map: {
              input: { $ifNull: ['$reviews.reviews', []] },
              as: 'review',
              in: {
                $mergeObjects: [
                  '$$review',
                  {
                    user: {
                      $let: {
                        vars: {
                          matched: {
                            $first: {
                              $filter: {
                                input: '$reviewProfiles',
                                as: 'p',
                                cond: { $eq: ['$$p._id', '$$review.user'] },
                              },
                            },
                          },
                        },
                        in: {
                          firstName: '$$matched.firstName',
                          avatarId: '$$matched.avatarId',
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $project: { reviewProfiles: 0 } },
      {
        $lookup: {
          from: 'categories',
          let: { categorySlug: '$primeCategory' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$slug', '$$categorySlug'] },
                    { $eq: ['$type', 'prime'] },
                  ],
                },
              },
            },
            { $project: { _id: 0, name: 1, slug: 1 } },
          ],
          as: 'primeCategory',
        },
      },
      { $unwind: { path: '$primeCategory', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          let: { categorySlug: '$subCategory' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$slug', '$$categorySlug'] },
                    { $eq: ['$type', 'sub'] },
                  ],
                },
              },
            },
            { $project: { _id: 0, name: 1, slug: 1 } },
          ],
          as: 'subCategory',
        },
      },
      { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          let: { categorySlug: '$basicCategory' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$slug', '$$categorySlug'] },
                    { $eq: ['$type', 'basic'] },
                  ],
                },
              },
            },
            { $project: { _id: 0, name: 1, slug: 1 } },
          ],
          as: 'basicCategory',
        },
      },
      { $unwind: { path: '$basicCategory', preserveNullAndEmptyArrays: true } },
    ]);

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

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

    // aggregate() returns plain objects, not Mongoose documents, so there's
    // no `.id` virtual here - use `_id` directly.
    await this.update(product._id.toString(), newViews);

    return { product };
  }

  // IBrandsRO[]
  async findAllBrands(): Promise<IBrandsRO[]> {
    return this.productModel.aggregate([
      {
        $project: {
          company: '$specifications.company',
          firstLetter: {
            $toUpper: {
              $substrCP: ['$specifications.company.displayName', 0, 1],
            },
          },
        },
      },
      {
        $project: {
          company: 1,
          group: {
            $cond: {
              if: {
                $regexMatch: {
                  input: '$firstLetter',
                  regex: /^[A-Z]$/,
                },
              },
              then: '$firstLetter',
              else: '#',
            },
          },
        },
      },
      {
        $group: {
          _id: '$group',
          brands: {
            $addToSet: {
              slug: '$company.slug',
              displayName: '$company.displayName',
            },
          },
        },
      },
      {
        $addFields: {
          sortOrder: {
            $cond: [{ $eq: ['$_id', '#'] }, 0, 1],
          },
        },
      },
      {
        $sort: {
          sortOrder: 1,
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          brands: {
            $sortArray: {
              input: '$brands',
              sortBy: {
                displayName: 1,
              },
            },
          },
        },
      },
    ]);
  }

  public async findTopPopular(query?: any): Promise<ProductDocument[]> {
    const { limit = 10 } = query;
    return this.productModel
      .find()
      .sort({ views: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  async findTopByPrimeCategories(): Promise<any> {
    return this.productModel.aggregate([
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
      {
        $group: {
          _id: '$primeCategory',
          products: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          products: {
            $slice: [
              {
                $sortArray: {
                  input: '$products',
                  sortBy: { popularity: -1 },
                },
              },
              5,
            ],
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
        producingCountry:
          data.specifications?.producingCountry ??
          product.specifications.producingCountry,
        quantity:
          data.specifications?.quantity ?? product.specifications.quantity,
        shelfLife:
          data.specifications?.shelfLife ?? product.specifications.shelfLife,
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

  // Helpers
  private normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private toClientProduct(doc: IProductRaw): IProduct {
    const {
      _id,
      createdAt,
      updatedAt,
      price: {
        _id: priceId,
        createdAt: priceCreatedAt,
        updatedAt: priceUpdatedAt,
        __v: priceV,
        ...priceRest
      },
      ...rest
    } = doc;
    return {
      ...rest,
      price: priceRest,
    };
  }

  private toServerProduct(doc: IProductRaw): IProductRaw {
    return doc;
  }

  // Repository (DB) layer
  private async findAll(query: IProductQuery): Promise<IProductsRawRO> {
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
    } = query;

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

    // Search normalization
    const normalizedSearch = slug ? slugifySearch(slug) : '';
    const searchWords = normalizedSearch.split('-').filter(Boolean);
    const slugMatch = searchWords.length
      ? {
          $and: searchWords.map((w) => ({
            slug: { $regex: w, $options: 'i' },
          })),
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
            ...slugMatch,
          },
        },
        {
          $lookup: {
            from: 'categories',
            let: { categorySlug: '$primeCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'prime'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'primeCategory',
          },
        },
        {
          $unwind: { path: '$primeCategory', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'categories',
            let: { categorySlug: '$subCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'sub'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'subCategory',
          },
        },
        { $unwind: { path: '$subCategory', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'categories',
            let: { categorySlug: '$basicCategory' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$slug', '$$categorySlug'] },
                      { $eq: ['$type', 'basic'] },
                    ],
                  },
                },
              },
              { $project: { _id: 0, name: 1, slug: 1 } },
            ],
            as: 'basicCategory',
          },
        },
        {
          $unwind: { path: '$basicCategory', preserveNullAndEmptyArrays: true },
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
                if: '$price.discountPrice',
                then: '$price.discountPrice',
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
          $match: dietary
            ? {
                'tags.dietaries': {
                  $in: dietary.split('+'),
                },
              }
            : {},
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
          $unset: ['__v', 'price.__v', 'reviews.__v'],
        },
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
