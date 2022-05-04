import {
  Get,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  Controller,
  Logger,
  ParamData,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';
import { IProductRO, IProductsRO } from './product.interface';

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
  getAll(@Query() query): Promise<IProductsRO> {
    this.logger.log('Handling getAll() request...');
    return this.productsService.getAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: ParamData): Promise<IProductRO> {
    this.logger.log('Handling findOne() request...');
    return this.productsService.findOne({ slug });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateProductDto) {
    this.logger.log('Handling update() request with id=' + id + '...');
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log('Handling delete() request with id=' + id + '...');
    return this.productsService.delete(id);
  }
}
