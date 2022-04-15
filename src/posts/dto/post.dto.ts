import { IsNotEmpty, IsString } from 'class-validator';
import { PostCategory } from '../enum/post.enum';

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
  readonly category: PostCategory;
}
