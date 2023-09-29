import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemes/comment.scheme';
import { PostsService } from '../posts/posts.service';
import { CommentDto } from './dto/comment.dto';
import { PostDocument } from '../posts/schemes/post.scheme';
import { UpdatePostDto } from '../posts/dto/udpate-post.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentQuery } from './interfaces/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private postService: PostsService,
  ) {}

  async create(
    data: CommentDto,
    postSlug: string,
    userId: string,
  ): Promise<PostDocument> {
    const post = await this.postService.getBySlug(postSlug);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const comment: CommentDto = {
      userId,
      text: data.text,
      postSlug,
    };

    const createdComment = await new this.commentModel(comment).save();

    if (!createdComment)
      throw new HttpException(
        'Comment wasn`t created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const newPostCommnets: UpdatePostDto = {
      comments: !post.comments
        ? [createdComment.id]
        : [...post.comments, createdComment.id],
    };

    return await this.postService.update(post.id, newPostCommnets);
  }

  async read(query): Promise<any> {
    const { limit, offset = '0', sort, order }: ICommentQuery = query;
    return this.commentModel
      .find()
      .sort({ [sort]: order === 'desc' ? 1 : -1 })
      .skip(+offset)
      .limit(+limit)
      .populate({
        path: 'userId',
        select: 'fullName',
      })
      .exec();
  }

  async update(id: string, data: UpdateCommentDto): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new HttpException(
        `That comment doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.commentModel
      .findByIdAndUpdate(id, data)
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
