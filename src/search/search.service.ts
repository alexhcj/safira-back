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

  async searchGlobal({ search }): Promise<ISearchRO> {
    const products = await this.productsService.findAll({ slug: search });
    const posts = await this.postsService.getAll({ search });

    const transformedProducts: ISearchProduct[] = products.products.map(
      ({ slug, name, subCategory, price }) => {
        return {
          type: 'product',
          slug,
          name,
          price,
          subCategory,
        };
      },
    );

    const transformedPosts: ISearchPost[] = posts.posts.map(
      ({ slug, title, createdAt }, index) => {
        return index < 5 && { type: 'post', slug, title, createdAt };
      },
    );

    return { search: [...transformedProducts, ...transformedPosts] };
  }
}
