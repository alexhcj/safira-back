import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto/tags.dto';

@Controller('tags')
export class TagsController {
  private readonly logger = new Logger(TagsController.name);

  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() data: CreateTagDto) {
    this.logger.log('Handling create() request...');
    return this.tagsService.create(data);
  }

  @Get()
  findAll() {
    this.logger.log('Handling findAll() request...');
    return this.tagsService.findAll();
  }

  @Get('/unique-dietary-tags')
  findUniqueDietaryTags() {
    this.logger.log('Handling findUniqueDietaryTags() request...');
    return this.tagsService.findUniqueDietaryTags();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateTagDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.tagsService.update(id, data);
  }

  @Get()
  findOne(@Query('id') id: string) {
    this.logger.log('Handling findOne() request...');
    return this.tagsService.findOne(id);
  }
}
