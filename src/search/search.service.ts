import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { PostsService } from '../posts/posts.service';
import {
  ISearchPost,
  ISearchProduct,
  ISearchRO,
} from './interfaces/search.interface';

@Injectable()
export class SearchService {
  constructor(
    private productsService: ProductsService,
    private postsService: PostsService,
  ) {}

  async findAllMatches({ search }): Promise<ISearchRO> {
    const products = await this.productsService.findAll({ slug: search });
    const posts = await this.postsService.getAll({ search });

    const transformedProducts: ISearchProduct[] = products.products
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ slug, name, subCategory, price }) => {
        return {
          type: 'product',
          slug,
          name,
          price,
          subCategory,
        };
      });

    const transformedPosts: ISearchPost[] = posts.posts.map(
      ({ slug, title, createdAt }) => {
        return { type: 'post', slug, title, createdAt };
      },
    );

    const productsData =
      transformedPosts.length >= 1
        ? transformedProducts.slice(0, 4)
        : transformedProducts.slice(0, 5);
    const postsData =
      productsData.length < 4
        ? transformedPosts.slice(0, transformedPosts.length - 1)
        : productsData.length === 4
        ? transformedPosts.slice(0, 1)
        : [];

    const relatedProducts = transformedProducts.length - productsData.length;

    return {
      search: [...productsData, ...postsData],
      relatedCount: relatedProducts,
    };
  }
}
