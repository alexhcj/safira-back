import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schemes/tag.scheme';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/tag.dto';
import { TagRO } from './interfaces/tag.interface';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(dto: CreateTagDto): Promise<TagRO> {
    const existedTag = await this.tagModel.findOne({ tag: dto.tag });

    if (existedTag)
      throw new HttpException(
        `This tag already exists`,
        HttpStatus.BAD_REQUEST,
      );

    const newTag: CreateTagDto = {
      tag: dto.tag,
      type: dto.type,
    };

    const tag = await new this.tagModel(newTag).save();
    return { tag };
  }

  async getAll(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  // common methods
  async findOne(where): Promise<TagRO> {
    const tag = await this.tagModel.findOne({ where }).exec();
    return { tag };
  }
}
