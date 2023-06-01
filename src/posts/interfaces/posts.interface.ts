import { Post } from '../schemes/post.scheme';

interface IPostMeta {
  total: number;
  page: number | string;
  isLastPage: boolean;
}

export interface IPostsRO {
  posts: Post[];
  meta: IPostMeta;
}

export interface IPostQuery {
  search?: string;
  tags?: string | [];
  category?: string | [];
  sort?: IPostSort;
  limit?: number;
  offset?: number;
}

export interface IPostFilter {
  title?: string | { $regex: string; $options?: string };
}

export interface IPostSort {
  sort: 'createdAt';
}
