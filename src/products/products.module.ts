import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductScheme } from './schemes/product.scheme';
import { Price, PriceScheme } from '../prices/schemes/price.scheme';
import { Tag, TagScheme } from '../tags/schemes/tag.scheme';
import { PricesService } from '../prices/prices.service';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductScheme },
      { name: Price.name, schema: PriceScheme },
      { name: Tag.name, schema: TagScheme },
    ]),
    TagsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PricesService],
  exports: [ProductsService],
})
export class ProductsModule {}
