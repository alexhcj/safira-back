import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductScheme } from './schemes/product.scheme';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductScheme }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
