import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsNumber()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly reviewProductSlug: string;
}
