import { ProductTagsEnum } from '../enum/product-tags.enum';
import { TagTypeEnum } from '../enum/tag-type.enum';
import { IsEnum } from 'class-validator';

export class CreateTagDto {
  @IsEnum(ProductTagsEnum)
  readonly tag: ProductTagsEnum;

  @IsEnum(TagTypeEnum)
  readonly type: TagTypeEnum;
}
