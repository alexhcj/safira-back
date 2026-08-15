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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  IBrandsRO,
  IProductRO,
  IProductsBySlugRO,
  IProductsRO,
} from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument } from './schemes/product.scheme';
import { Aggregate } from 'mongoose';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private productsService: ProductsService) {}

  @Post('create')
  create(@Body() data: CreateProductDto) {
    this.logger.log('Handling create() request...');
    return this.productsService.create(data);
  }

  @Get('list')
  findAll(@Query() query): Promise<IProductsRO> {
    this.logger.log('Handling findAll() request...');
    return this.productsService.findAllClient(query);
    // findAllClient
  }

  @Get('related')
  findRelated(@Query() query): Promise<ProductDocument[]> {
    this.logger.log('Handling findRelated() request...');
    return this.productsService.findRelated(query);
  }

  @Get('random')
  findRandom(@Query() query): Promise<Aggregate<ProductDocument[]>> {
    this.logger.log('Handling findRandom() request...');
    return this.productsService.findRandom(query);
  }

  @Get('list-brands')
  getQueryBrands(@Query() query): Promise<any> {
    this.logger.log('Handling getQueryBrands() request...');
    return this.productsService.getQueryBrands(query);
  }

  @Get('list-tags')
  findQueryDietaryTags(@Query() query): Promise<any> {
    this.logger.log('Handling findQueryDietaryTags() request...');
    return this.productsService.findQueryDietaryTags(query);
  }

  @Get('price-range')
  getQueryPriceRange(@Query() query): Promise<any> {
    this.logger.log('Handling getQueryPriceRange() request...');
    return this.productsService.getQueryPriceRange(query);
  }

  @Get('list-by-slug')
  findListBySlug(@Query() query): Promise<IProductsBySlugRO> {
    this.logger.log('Handling findListBySlug() request...');
    return this.productsService.findListBySlug(query);
  }

  @Get('all-brands')
  findAllBrands(): Promise<IBrandsRO[]> {
    this.logger.log('Handling findAllBrands() request...');
    return this.productsService.findAllBrands();
  }

  @Get('top-popular')
  findTopPopular(@Query() query): Promise<ProductDocument[]> {
    this.logger.log('Handling findTopPopular() request...');
    return this.productsService.findTopPopular(query);
  }

  @Get('top-by-prime-categories')
  findTopByPrimeCategories(): Promise<any> {
    this.logger.log('Handling findTopByPrimeCategories() request...');
    return this.productsService.findTopByPrimeCategories();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Promise<IProductRO> {
    this.logger.log('Handling findBySlug() request...');
    return this.productsService.findBySlug(slug);
  }

  @Put(':slug')
  update(@Param('slug') slug: string, @Body() data: UpdateProductDto) {
    this.logger.log('Handling update() request for product = ' + slug);
    return this.productsService.update(slug, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.productsService.delete(id);
  }
}
