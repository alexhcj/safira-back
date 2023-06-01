import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  Logger,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private postsService: PostsService) {}

  @Post('create')
  create(@Body() data: CreatePostDto) {
    this.logger.log('Handling create() request...');
    return this.postsService.create(data);
  }

  @Get('list')
  getAll(@Query() query) {
    this.logger.log('Handling read() request...');
    return this.postsService.getAll(query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreatePostDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.postsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.postsService.delete(id);
  }
}
