import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ICategory,
  ICategoryFilter,
  ICategoryQuery,
} from './interfaces/category.interface';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemes/category.scheme';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(data: CreateCategoryDto) {
    const newCategory: ICategory = {
      name: data.name,
      slug: data.slug,
      type: data.type,
      parentId: data.parentId,
      order: data.order,
    };

    const createdCategory = new this.categoryModel(newCategory);

    try {
      return await createdCategory.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          `A "${data.type}" category with slug "${data.slug}" already exists`,
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }

  /**
   * Returns all categories rebuilt into a nested tree, in the same shape
   * the frontend's `categories-data.js` static file already used:
   *
   *   [{ name, primeCategory, subCategories: { parentCategory, items: [
   *        { name, subCategory, basicCategories: [{ name, basicCategory }] }
   *      ] } }]
   *
   * Matching that shape exactly means the frontend's tree-consuming code
   * (dropdown nav, `categoriesLookup.js`) doesn't need to change at all when
   * it switches from importing the static file to fetching this endpoint -
   * only the data source changes, not the shape.
   */
  async findTree() {
    const categories = await this.categoryModel
      .find()
      .sort({ order: 1 })
      .lean()
      .exec();

    const byParentId = new Map<string, typeof categories>();
    categories.forEach((category) => {
      const key = category.parentId ? category.parentId.toString() : 'root';
      const siblings = byParentId.get(key) ?? [];
      siblings.push(category);
      byParentId.set(key, siblings);
    });

    const primeCategories = byParentId.get('root') ?? [];

    return primeCategories.map((prime) => {
      const subCategories = byParentId.get(prime._id.toString()) ?? [];

      return {
        name: prime.name,
        primeCategory: prime.slug,
        subCategories: {
          parentCategory: prime.slug,
          items: subCategories.map((sub) => {
            const basicCategories = byParentId.get(sub._id.toString()) ?? [];

            return {
              name: sub.name,
              subCategory: sub.slug,
              basicCategories: basicCategories.map((basic) => ({
                name: basic.name,
                basicCategory: basic.slug,
              })),
            };
          }),
        },
      };
    });
  }

  async findAll(query) {
    const {
      name,
      slug,
      type,
      sort = 'order',
      order,
      limit,
    }: ICategoryQuery = query;

    const find: ICategoryFilter = {};

    if (name) find.name = { $regex: `${name}`, $options: 'i' };
    if (slug) find.slug = { $regex: `${slug}`, $options: 'i' };
    if (type) find.type = type;

    const categories = await this.categoryModel
      .find(find)
      .sort({ [sort]: order === 'desc' ? 1 : -1 })
      .limit(+limit)
      .exec();

    return {
      categories,
      meta: {
        total: categories.length,
      },
    };
  }

  async findByName(name: string) {
    const category = await this.categoryModel.findOne({ name }).exec();

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(new Types.ObjectId(id));

    if (!category) {
      throw new HttpException(`Category doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return this.categoryModel
      .findByIdAndUpdate(id, data)
      .setOptions({ new: true })
      .exec();
  }

  async delete(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException(
        'There is no such category.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  private async findById(id: Types.ObjectId): Promise<CategoryDocument> {
    return this.categoryModel.findById(id).exec();
  }
}
