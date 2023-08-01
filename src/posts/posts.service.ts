import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemes/post.scheme';
import { CreatePostDto } from './dto/post.dto';
import { IPostQuery, IPostsRO } from './interfaces/posts.interface';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(data: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(data);
    return createdPost.save();
  }

  async getAll(query): Promise<IPostsRO> {
    // TODO: extend with (tags, category) fields
    const { search, sort, order, limit, offset = '0' }: IPostQuery = query;

    const [{ posts, total }] = await this.postModel.aggregate([
      {
        $match: {
          title: { $regex: `${search ? search : ''}`, $options: 'i' },
        },
      },
      {
        $sort: {
          [`${sort}`]: order === 'desc' ? 1 : -1,
        },
      },
      {
        $facet: {
          posts: [{ $skip: +offset }, { $limit: +limit }],
          total: [{ $count: 'total' }],
        },
      },
    ]);

    const page: number = +limit !== 0 ? +offset / +limit + 1 : 1;
    const isLastPage =
      page * +limit === total[0].total || page * +limit > total[0].total;

    return { posts, meta: { total: total[0].total, page, isLastPage } };
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
