import { TagTypeEnum } from '../enum/tag-type.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { Tags } from '../schemes/tag.scheme';

export class CreateTagDto {
  @IsEnum(TagTypeEnum)
  readonly type: TagTypeEnum;

  readonly tags: Tags;
}

export class UpdateTagDto {
  @IsOptional()
  type?: TagTypeEnum;

  @IsOptional()
  tags?: Tags;
}
