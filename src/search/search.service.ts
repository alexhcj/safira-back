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
    const [products, posts] = await Promise.all([
      this.productsService.findAll({ slug: search }),
      this.postsService.getAll({ search }),
    ]);

    const transformedProducts: ISearchProduct[] = products.products
      .sort((a, b) => b.popularity - a.popularity)
      .map(({ slug, name, subCategory, price }) => ({
        type: 'product',
        slug,
        name,
        price,
        subCategory,
      }));

    const transformedPosts: ISearchPost[] = posts.posts.map(
      ({ slug, title, createdAt }) => ({
        type: 'post',
        slug,
        title,
        createdAt,
      }),
    );

    const maxProducts = transformedPosts.length >= 1 ? 4 : 5;
    const productsData = transformedProducts.slice(0, maxProducts);

    const maxPosts =
      productsData.length < 4
        ? Math.min(5 - productsData.length, transformedPosts.length)
        : 1;
    const postsData = transformedPosts.slice(0, maxPosts);

    const relatedProducts = Math.max(
      0,
      transformedProducts.length - productsData.length,
    );

    return {
      search: [...productsData, ...postsData],
      relatedCount: relatedProducts,
    };
  }
}
