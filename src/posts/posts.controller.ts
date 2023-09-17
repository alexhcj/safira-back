import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

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

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    this.logger.log('Handling getBySlug() request...');
    return this.postsService.getBySlug(slug);
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
