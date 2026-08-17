import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  private readonly logger = new Logger(BrandsController.name);

  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() data: CreateBrandDto) {
    this.logger.log('Handling create() request...');
    return this.brandsService.create(data);
  }

  @Get()
  findAll(@Query() query) {
    this.logger.log('Handling findAll() request...');
    return this.brandsService.findAll(query);
  }

  @Get('grouped-brands')
  findGroupedBrands() {
    this.logger.log('Handling findGroupedBrands() request...');
    return this.brandsService.findGroupedBrands();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    this.logger.log('Handling findBySlug() request...');
    return this.brandsService.findBySlug(slug);
  }

  @Get('find-or-create-brand/:displayName')
  findOrCreateBrand(@Param('displayName') displayName: string) {
    this.logger.log('Handling findOrCreateBrand() request...');
    return this.brandsService.findOrCreateBrand(displayName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Handling findOne() request...');
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    this.logger.log('Handling update() request for product = ' + id);
    return this.brandsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.brandsService.delete(id);
  }
}
