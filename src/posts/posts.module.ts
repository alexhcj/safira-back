import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostScheme } from './schemes/post.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostScheme }]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
