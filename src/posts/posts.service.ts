import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemes/post.scheme';
import { CreatePostDto } from './dto/create-post.dto';
import { IPostQuery, IPostsRO } from './interfaces/posts.interface';
import { UpdatePostDto } from './dto/udpate-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(data: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(data);
    return createdPost.save();
  }

  async getAll(query): Promise<IPostsRO> {
    const {
      search,
      sort = 'createdAt',
      order = 'desc',
      limit = '10',
      offset = '0',
    }: IPostQuery = query;

    // build match conditions
    const matchConditions: any = {};

    if (search) {
      const escapedSearch = await this._escapeRegex(search);

      // create multiple search patterns for better matching
      const searchPatterns = await this._createSearchPatterns(search);

      matchConditions.$or = [
        // title search with multiple patterns
        ...searchPatterns.map((pattern) => ({
          title: { $regex: pattern, $options: 'i' },
        })),
        { text: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;

    const [result] = await this.postModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: {
          [sort]: sortOrder,
        },
      },
      {
        $facet: {
          posts: [
            { $skip: Math.max(0, +offset) },
            { $limit: Math.max(1, Math.min(100, +limit)) }, // limit max results
          ],
          total: [{ $count: 'total' }],
        },
      },
    ]);

    const { posts = [], total = [] } = result || {};

    if (posts.length === 0) {
      return {
        posts: [],
        meta: {
          total: 0,
          page: 0,
          isLastPage: null,
        },
      };
    }

    const totalCount = total[0]?.total || 0;
    const page: number = +limit !== 0 ? Math.floor(+offset / +limit) + 1 : 1;
    const isLastPage = +limit === 0 || page * +limit >= totalCount;

    return {
      posts,
      meta: {
        total: totalCount,
        page,
        isLastPage,
      },
    };
  }

  async update(id: string, data: UpdatePostDto): Promise<PostDocument> {
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

  public async getBySlug(slug: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ slug })
      .populate({
        path: 'user',
        foreignField: 'userId',
        select: 'firstName lastName avatarId -userId',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'comments.user',
          foreignField: 'userId',
          select: 'firstName avatarId userId',
        },
      })
      .exec();

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    // Recursively populate nested comments
    if (post.comments && post.comments.comments) {
      await this._populateNestedComments(post.comments.comments);
    }

    return post;
  }

  private async _populateNestedComments(comments): Promise<void> {
    if (!Array.isArray(comments)) {
      return;
    }

    for (const comment of comments) {
      if (comment.comments && comment.comments.length > 0) {
        // Populate user data for nested comments
        await this.postModel.populate(comment.comments, {
          path: 'user',
          foreignField: 'userId',
          select: 'firstName avatarId userId',
        });

        // Recursively populate deeper levels
        await this._populateNestedComments(comment.comments);
      }
    }
  }

  // helper function to escape regex special characters
  private async _escapeRegex(string: string): Promise<string> {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // helper function to create search patterns for partial matching
  private async _createSearchPatterns(searchTerm: string): Promise<string[]> {
    const escaped = await this._escapeRegex(searchTerm.trim());

    return [
      escaped, // exact match
      `\\b${escaped}`, // word boundary start
      `${escaped}\\b`, // word boundary end
      `\\b${escaped}\\b`, // complete word
    ];
  }
}
