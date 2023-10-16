import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductScheme } from './schemes/product.scheme';
import { Price, PriceScheme } from '../prices/schemes/price.scheme';
import { PricesModule } from '../prices/prices.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductScheme },
      { name: Price.name, schema: PriceScheme },
    ]),
    PricesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
