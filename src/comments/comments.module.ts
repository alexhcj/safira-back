import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentScheme } from './schemes/comment.scheme';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    PostsModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentScheme }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
