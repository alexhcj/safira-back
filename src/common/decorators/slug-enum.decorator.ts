import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { fromSlug } from '../utils';

export function SlugEnum<T extends Record<string, string>>(
  enumType: T,
): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => fromSlug(value, enumType), { toClassOnly: true }),
    IsEnum(enumType),
  );
}
