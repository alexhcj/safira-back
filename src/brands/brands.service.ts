import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from './schemes/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandStatusEnum } from './enums/brand-status.enum';
import { slugify } from '../common/utils';
import { normalizeCompanyName } from '../helpers';
import {
  IBrandsQuery,
  IBrandsRO,
  IFindBrandBySlugRO,
} from './interfaces/brand.interface';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandDocument> {
    const normalizedName = normalizeCompanyName(createBrandDto.displayName);
    const slug = slugify(normalizedName);

    try {
      return await this.brandModel.create({
        ...createBrandDto,
        normalizedName,
        slug,
      });
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('A brand with this name already exists');
      }
      throw e;
    }
  }

  public async findAll(query: IBrandsQuery): Promise<BrandDocument[]> {
    const { includeArchived } = query;

    const filter = includeArchived
      ? {}
      : { status: { $ne: BrandStatusEnum.ARCHIVED } };

    return this.brandModel.find(filter).exec();
  }

  public async findOne(id: string): Promise<BrandDocument> {
    const brand = await this.brandModel.findById(id).exec();

    if (!brand) throw new NotFoundException(`Brand ${id} not found`);

    return brand;
  }

  public async findBySlug(slug: string): Promise<IFindBrandBySlugRO> {
    const brand = await this.brandModel.findOne({ slug }).exec();

    if (!brand)
      throw new NotFoundException(`Brand with slug "${slug}" not found`);

    return { brand };
  }

  public async findGroupedBrands(): Promise<IBrandsRO[]> {
    return this.brandModel.aggregate([
      { $match: { status: BrandStatusEnum.ACTIVE } }, // exclude archived/pending from public listing
      {
        $project: {
          slug: 1,
          displayName: 1,
          firstLetter: { $toUpper: { $substrCP: ['$displayName', 0, 1] } },
        },
      },
      {
        $project: {
          slug: 1,
          displayName: 1,
          group: {
            $cond: {
              if: { $regexMatch: { input: '$firstLetter', regex: /^[A-Z]$/ } },
              then: '$firstLetter',
              else: '#',
            },
          },
        },
      },
      {
        $group: {
          _id: '$group',
          brands: { $addToSet: { slug: '$slug', displayName: '$displayName' } },
        },
      },
      { $addFields: { sortOrder: { $cond: [{ $eq: ['$_id', '#'] }, 0, 1] } } },
      { $sort: { sortOrder: 1, _id: 1 } },
      {
        $project: {
          _id: 0,
          name: '$_id',
          brands: {
            $sortArray: { input: '$brands', sortBy: { displayName: 1 } },
          },
        },
      },
    ]);
  }

  public async findIdsBySlugs(slugs: string[]): Promise<Types.ObjectId[]> {
    const brands = await this.brandModel
      .find({ slug: { $in: slugs } }, { _id: 1 })
      .exec();
    return brands.map((b) => b._id);
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandDocument> {
    // if displayName changes, normalizedName/slug must be recomputed server-side too —
    // never trust a client-supplied normalizedName/slug on update either
    const patch: Partial<Brand> = { ...updateBrandDto };

    if (updateBrandDto.displayName) {
      patch.normalizedName = normalizeCompanyName(updateBrandDto.displayName);
      patch.slug = slugify(patch.normalizedName);
    }

    const brand = await this.brandModel
      .findByIdAndUpdate(id, patch, { new: true })
      .exec();

    if (!brand) throw new NotFoundException(`Brand ${id} not found`);

    return brand;
  }

  // Soft delete — archive, don't hard-delete, so existing product.brandId
  // references and merge history stay intact (per the earlier "archive not delete" note)
  async delete(id: string): Promise<BrandDocument> {
    return this.update(id, { status: BrandStatusEnum.ARCHIVED });
  }

  /**
   * Atomic upsert to avoid the race condition of separate find-then-create calls.
   */
  async findOrCreateBrand(displayName: string): Promise<BrandDocument> {
    const normalizedName = normalizeCompanyName(displayName);

    const brand = await this.brandModel.findOne({
      $or: [{ normalizedName }, { aliases: displayName }],
    });

    if (brand) return brand;

    const slug = slugify(normalizedName);

    try {
      return await this.brandModel.findOneAndUpdate(
        { normalizedName },
        {
          $setOnInsert: {
            displayName,
            normalizedName,
            slug,
            status: BrandStatusEnum.ACTIVE,
            type: 'corporate',
            source: 'auto-created',
          },
        },
        { upsert: true, new: true },
      );
    } catch (e) {
      if (e.code === 11000) {
        return this.brandModel.findOne({ normalizedName });
      }

      throw e;
    }
  }

  /** Used by ProductsService when linking a product to a brand it already resolved */
  async findByIdOrFail(
    brandId: Types.ObjectId | string,
  ): Promise<BrandDocument> {
    const brand = await this.brandModel.findById(brandId).exec();

    if (!brand) throw new NotFoundException(`Brand ${brandId} not found`);

    return brand;
  }
}
