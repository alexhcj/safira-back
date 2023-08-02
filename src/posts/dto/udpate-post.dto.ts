import { IsOptional, IsString } from 'class-validator';
import { PostCategoryEnum } from '../enums/post-category.enum';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly text?: string;

  @IsString()
  @IsOptional()
  readonly img?: string;

  @IsString()
  @IsOptional()
  readonly category?: PostCategoryEnum;

  @IsString()
  @IsOptional()
  comments?: string[];
}
