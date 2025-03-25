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
    // TODO: add transform query to indeed formats (number, string)
    return this.productsService.findAll(query);
  }

  @Get('related')
  findRelated(@Query() query): Promise<ProductDocument[]> {
    this.logger.log('Handling findRelated() request...');
    return this.productsService.findRelated(query);
  }

  @Get('find-top-ten-popular')
  findTopTenPopular(): Promise<ProductDocument[]> {
    this.logger.log('Handling findTopTenPopular() request...');
    return this.productsService.findTopTenPopular();
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

  @Get('price-range')
  getQueryPriceRange(@Query() query): Promise<any> {
    this.logger.log('Handling getQueryPriceRange() request...');
    return this.productsService.getQueryPriceRange(query);
  }

  @Get('list-by-slug')
  getAllBySlug(@Query() query): Promise<IProductsBySlugRO> {
    this.logger.log('Handling getAllByName() request...');
    return this.productsService.getAllBySlug(query);
  }

  @Get('all-brands')
  findAllBrands(): Promise<IBrandsRO[]> {
    this.logger.log('Handling findAllBrands() request...');
    return this.productsService.findAllBrands();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Promise<IProductRO> {
    this.logger.log('Handling findOne() request...');
    return this.productsService.findBySlug(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.productsService.delete(id);
  }
}
