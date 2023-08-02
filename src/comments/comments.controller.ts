import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  read() {
    this.logger.log('Handling read() request...');
    return this.commentsService.read();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug')
  // TODO: replace any
  create(
    @Body() data: CommentDto,
    @Param('slug') slug: string,
    @Req() req: any,
  ) {
    this.logger.log('Handling create() request...');
    return this.commentsService.create(data, slug, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CommentDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.commentsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.commentsService.delete(id);
  }
}
