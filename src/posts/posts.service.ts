import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemes/post.scheme';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(data: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(data);
    return createdPost.save();
  }

  async read(): Promise<Post[]> {
    return this.postModel.find().exec();
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
