import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductScheme } from './schemes/product.scheme';
import { Price, PriceScheme } from '../prices/schemes/price.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductScheme },
      { name: Price.name, schema: PriceScheme },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
