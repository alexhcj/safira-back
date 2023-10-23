import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemes/comment.scheme';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  IComment,
  ICommentEntity,
  ICommentQuery,
  ICommentUpdateQuery,
} from './interfaces/comment.interface';
import { deepCountComments } from '../helpers';
import { UpdatePostDto } from '../posts/dto/udpate-post.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    private postService: PostsService,
  ) {}

  async create(
    slug: string,
    userId: string,
    data: CreateCommentDto,
  ): Promise<CommentDocument> {
    const post = await this.postService.getBySlug(slug);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const commentEntity = await this.commentModel.findOne({ postSlug: slug });

    if (commentEntity)
      throw new HttpException('Comment already exists', HttpStatus.BAD_REQUEST);

    const comment: IComment = {
      user: {
        _id: new Types.ObjectId(userId),
        fullName: 'John Been',
      },
      text: data.text,
    };

    const newCommentEntity: ICommentEntity = {
      postSlug: slug,
      comments: [comment],
    };

    const createdComment = await new this.commentModel(newCommentEntity).save();

    const postWithComments: UpdatePostDto = {
      comments: createdComment._id,
    };

    await this.postService.update(post._id, postWithComments);

    return createdComment;
  }

  async read(query): Promise<CommentDocument[]> {
    const { limit, offset = '0', sort, order }: ICommentQuery = query;
    return this.commentModel
      .find()
      .sort({ [sort]: order === 'desc' ? 1 : -1 })
      .skip(+offset)
      .limit(+limit)
      .exec();
  }

  async findRecentComments(query): Promise<any> {
    const { limit }: ICommentQuery = query;
    const comments = await this.commentModel.find().exec();
    const allComments = comments.reduce(
      (acc, cur) => [...acc, ...cur.comments],
      [],
    );
    const commentsArr = deepCountComments(allComments);
    const sortedComments: IComment[] = commentsArr.sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    );
    return sortedComments.slice(0, +limit);
  }

  async update(
    postSlug: string,
    data: UpdateCommentDto,
    { nestedLvl }: ICommentUpdateQuery,
  ): Promise<CommentDocument> {
    const commentEntity = await this.commentModel.findOne({ postSlug });

    // generates path to replied comment replies.0.replies.2.replies...
    const commentPath =
      nestedLvl === ''
        ? 'comments'
        : 'comments' +
          nestedLvl
            .split('|')
            .map((item) => {
              return `.${item}.comments`;
            })
            .join('');

    if (!commentEntity) {
      throw new HttpException(
        `That comment doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const comment: IComment = {
      user: {
        _id: new Types.ObjectId(data.userId),
        fullName: 'John Been',
      },
      text: data.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.commentModel
      .findByIdAndUpdate(commentEntity.id, {
        $push: { [`${commentPath}`]: comment },
      })
      .setOptions({ new: true });
  }

  async delete(id: string) {
    const review = await this.commentModel.findById(id);

    if (!review) {
      throw new HttpException(
        `That review doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.commentModel.findByIdAndDelete(id).exec();
  }
}
