import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() data: CreateCategoryDto) {
    this.logger.log('Handling create() request...');
    return this.categoriesService.create(data);
  }

  @Get('tree')
  findTree() {
    this.logger.log('Handling findTree() request...');
    return this.categoriesService.findTree();
  }

  @Get()
  findAll(@Query() query) {
    this.logger.log('Handling findAll() request...');
    return this.categoriesService.findAll(query);
  }

  @Get('name/:name')
  findByName(@Param('name') name: string) {
    this.logger.log('Handling findByName() request...');
    return this.categoriesService.findByName(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    this.logger.log('Handling update() request...');
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request...');
    return this.categoriesService.delete(id);
  }
}
