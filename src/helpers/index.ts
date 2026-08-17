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

export const slugifySearch = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '') // strip apostrophes/quotes: Aw's -> Aws
    .replace(/[^a-z0-9]+/g, '-') // spaces, parens, etc -> hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
};

export const normalizeCompanyName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};
