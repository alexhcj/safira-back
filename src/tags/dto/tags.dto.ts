import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Tags } from '../schemes/tag.scheme';
import { DietaryTagsEnum } from '../enum/dietary-tags.enum';
import { PromotionTagsEnum } from '../enum/promotion-tags.enum';
import { CommonTagsEnum } from '../enum/common-tags.enum';
import { TagTypeEnum } from '../enum/tag-type.enum';

export class TagsDto {
  @IsOptional()
  @IsArray()
  @IsEnum(DietaryTagsEnum, { each: true })
  dietaries?: DietaryTagsEnum[];

  @IsOptional()
  @IsArray()
  @IsEnum(CommonTagsEnum, { each: true })
  common?: CommonTagsEnum[];

  @IsOptional()
  @IsArray()
  @IsEnum(PromotionTagsEnum, { each: true })
  promotions?: PromotionTagsEnum[];
}

export class CreateTagDto {
  @IsNotEmpty()
  @IsEnum(TagTypeEnum)
  readonly type: TagTypeEnum;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TagsDto)
  readonly tags: TagsDto;
}

export class UpdateTagDto {
  @IsOptional()
  type?: TagTypeEnum;

  @IsOptional()
  tags?: Tags;
}
