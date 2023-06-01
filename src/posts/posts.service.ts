import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemes/post.scheme';
import { CreatePostDto } from './dto/post.dto';
import {
  IPostFilter,
  IPostQuery,
  IPostsRO,
} from './interfaces/posts.interface';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(data: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(data);
    return createdPost.save();
  }

  async getAll(query): Promise<IPostsRO> {
    // TODO: extend with (tags, category) fields
    const { search, sort, limit, offset }: IPostQuery = query;

    const find: IPostFilter = {};

    if (search) find.title = { $regex: `${search}`, $options: 'i' };

    const postLimit = limit ? +limit : 0;
    const postOffset = offset ? +offset : 0;

    const posts = await this.postModel
      .find(find)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec();

    // meta info about posts res
    const total = posts.length;
    const page: number = postLimit !== 0 ? postOffset / postLimit + 1 : 1;
    const isLastPage =
      (total / page) * postLimit === 0 || total - page * postLimit === 1;

    return { posts, meta: { total, page, isLastPage } };
  }

  async update(id: string, data: CreatePostDto): Promise<Post> {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new HttpException(
        `Такой статьи не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.postModel.findByIdAndUpdate(id, data).setOptions({ new: true });
  }

  async delete(id: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new HttpException(
        `Такой статьи не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.postModel.findByIdAndDelete(id).exec();
  }
}
