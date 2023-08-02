import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly text: string;
}
