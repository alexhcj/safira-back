import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/tag.dto';

@Controller('tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Post('create')
  create(@Body() dto: CreateTagDto) {
    this.logger.log('Handling create() request...');
    return this.tagsService.create(dto);
  }

  @Get()
  getAll() {
    this.logger.log('Handling getAll() request...');
    return this.tagsService.getAll();
  }

  @Get()
  findOne(@Query('id') id: string) {
    this.logger.log('Handling findOne() request...');
    return this.tagsService.findOne(id);
  }
}
