import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SlugEnum } from '../../common/decorators/slug-enum.decorator';
import { CategoryTypeEnum } from '../enums/category-type.enum';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly slug: string;

  @IsNotEmpty()
  @SlugEnum(CategoryTypeEnum)
  readonly type: CategoryTypeEnum;

  @IsOptional()
  readonly parentId: Types.ObjectId | null;

  @IsOptional()
  readonly order: number;
}
