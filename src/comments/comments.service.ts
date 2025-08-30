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

    const comment: IComment = {
      user: {
        _id: new Types.ObjectId(userId),
        fullName: 'John Been',
      },
      text: data.text,
    };

    // if no comment entity exists, create one
    if (!commentEntity) {
      const newCommentEntity: ICommentEntity = {
        postSlug: slug,
        comments: [comment],
      };

      const createdComment = await new this.commentModel(
        newCommentEntity,
      ).save();

      const postWithComments: UpdatePostDto = {
        comments: createdComment._id,
      };

      await this.postService.update(post._id, postWithComments);

      return createdComment;
    }

    // if comment entity exists, add to root level
    return this.commentModel.findByIdAndUpdate(
      commentEntity._id,
      { $push: { comments: comment } },
      { new: true },
    );
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
    const comments = await this.commentModel
      .find()
      .populate('comments')
      .populate({
        path: 'comments.user',
        foreignField: 'userId',
        select: 'firstName avatarId -userId',
      })
      .exec();

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

  /**
   * Update method to add replies to nested comments
   *
   * @param postSlug - Post slug identifier
   * @param userId - User ID creating the reply
   * @param data - Comment data
   * @param nestedLvl - Dot-separated path (e.g., "0.1.2" for third reply to second reply of first comment)
   */
  async update(
    postSlug: string,
    userId: string,
    data: UpdateCommentDto,
    { nestedLvl }: ICommentUpdateQuery,
  ): Promise<CommentDocument> {
    const commentEntity = await this.commentModel.findOne({ postSlug });

    if (!commentEntity) {
      throw new HttpException(
        `Comment entity for post ${postSlug} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const comment: IComment = {
      user: {
        _id: new Types.ObjectId(userId),
        fullName: 'John Been',
      },
      text: data.text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // generate the MongoDB path for nested comment insertion
    const commentPath = this.generateCommentPath(nestedLvl);

    console.log(`Inserting comment at path: ${commentPath}`);
    console.log(`Nested level: ${nestedLvl}`);

    return this.commentModel.findByIdAndUpdate(
      commentEntity._id,
      { $push: { [`${commentPath}`]: comment } },
      { new: true },
    );
  }

  /**
   * Generate MongoDB path from nested level string
   *
   * Examples:
   * - "0" -> "comments.0.comments" (reply to first root comment)
   * - "0.1" -> "comments.0.comments.1.comments" (reply to second nested comment under first root comment)
   * - "1.0.2" -> "comments.1.comments.0.comments.2.comments" (reply to third comment under first reply of second root comment)
   *
   * @param nestedLvl - Dot-separated path string
   * @returns MongoDB field path for $push operation
   */
  private generateCommentPath(nestedLvl: string): string {
    if (!nestedLvl) {
      return 'comments'; // Root level
    }

    const indices = nestedLvl.split('.');

    // build path: comments.0.comments.1.comments.2.comments
    let path = 'comments';
    for (const index of indices) {
      path += `.${index}.comments`;
    }

    return path;
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
