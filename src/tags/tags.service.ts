import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemes/tag.scheme';
import { Model } from 'mongoose';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(data: CreateTagDto): Promise<Tag> {
    const tag: CreateTagDto = {
      type: data.type,
      tags: {
        dietaries: data.tags.dietaries,
        common: data.tags.common,
        promotions: data.tags.promotions,
      },
    };

    return new this.tagModel(tag).save();
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async update(id: string, data: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagModel.findById(id);

    if (!tag)
      throw new HttpException(
        `Searched tag doesn't exists`,
        HttpStatus.BAD_REQUEST,
      );

    const updatedTag: UpdateTagDto = {
      type: data.type,
      tags: {
        dietaries: data.tags.dietaries,
        common: data.tags.common,
        promotions: data.tags.promotions,
      },
    };

    return this.tagModel
      .findByIdAndUpdate(id, updatedTag)
      .setOptions({ new: true });
  }

  // common methods
  async findOne(where): Promise<Tag> {
    return this.tagModel.findOne({ where }).exec();
  }
}
