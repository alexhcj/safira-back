import { Types } from 'mongoose';

export interface ICommentQuery {
  limit?: string;
  offset?: string;
  sort?: string;
  order?: string;
}

export interface ICommentUpdateQuery {
  nestedLvl?: string;
}

export interface IComment {
  user: {
    _id: Types.ObjectId;
    fullName: string;
  };
  text: string;
  comments?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommentEntity {
  postSlug: string;
  comments: IComment[];
}
