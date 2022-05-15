import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsNumber()
  @IsNotEmpty()
  readonly rating: number;

  @IsNotEmpty()
  readonly reviewObjectSlug: string;
}
