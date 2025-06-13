import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';
import { fromSlugValue } from '../utils';
import {
  AllBasicCategoryValues,
  SlugToBasicCategoryMap,
} from '../../products/interfaces/category.interface';

export function SlugBasicCategory(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => fromSlugValue(value, SlugToBasicCategoryMap), {
      toClassOnly: true,
    }),
    IsIn(AllBasicCategoryValues),
  );
}
