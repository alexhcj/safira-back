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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  read(@Query() query) {
    this.logger.log('Handling read() request...');
    return this.commentsService.read(query);
  }

  @Get('recent-comments')
  findRecentComments(@Query() query) {
    this.logger.log('Handling findRecentComments() request...');
    return this.commentsService.findRecentComments(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug')
  create(
    @Param('slug') slug: string,
    @Req() req,
    @Body() data: CreateCommentDto,
  ) {
    this.logger.log('Handling create() request...');
    return this.commentsService.create(slug, req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':postSlug')
  update(
    @Param('postSlug') postSlug: string,
    @Req() req,
    @Body() data: UpdateCommentDto,
    @Query() query,
  ) {
    this.logger.log('Handling update() request with id=' + postSlug + '...');
    return this.commentsService.update(postSlug, req.user.userId, data, query);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.commentsService.delete(id);
  }
}
