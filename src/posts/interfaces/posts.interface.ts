import { PostCategoryEnum } from '../enums/post-category.enum';
import { Types } from 'mongoose';

interface IPost {
  id: string;
  userId: Types.ObjectId;
  title: string;
  slug: string;
  text: string;
  img: string;
  category: PostCategoryEnum;
  createdAt: Date;
  tags: string[];
}

interface IPostMeta {
  total: number;
  page: number | string;
  isLastPage: boolean;
}

export interface IPostsRO {
  posts: IPost[];
  meta: IPostMeta;
}

export interface IPostQuery {
  search?: string;
  tags?: string | [];
  category?: string | [];
  sort?: IPostSort;
  limit?: string;
  offset?: string;
  order?: string;
}

export interface IPostFilter {
  title?: string | { $regex: string; $options?: string };
}

export interface IPostSort {
  sort: 'createdAt';
}
