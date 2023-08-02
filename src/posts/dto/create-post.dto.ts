import { IsNotEmpty, IsString } from 'class-validator';
import { PostCategoryEnum } from '../enums/post-category.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly img: string;

  @IsString()
  @IsNotEmpty()
  readonly category: PostCategoryEnum;
}
