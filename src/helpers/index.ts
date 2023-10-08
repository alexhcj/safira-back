import { IComment } from '../comments/interfaces/comment.interface';

// get all nested comments in one array
export const deepCountComments = (arr: IComment[]): IComment[] => {
  let comments: IComment[] = [];

  const flattenMembers = arr.map((item: IComment) => {
    if (item.comments && item.comments.length) {
      comments = [...comments, ...item.comments];
    }
    return item;
  });

  return flattenMembers.concat(
    comments.length ? deepCountComments(comments) : comments,
  );
};
