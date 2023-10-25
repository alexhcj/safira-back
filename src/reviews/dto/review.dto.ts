import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  @IsOptional()
  readonly text: string;

  @IsNumber()
  @IsOptional()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly reviewProductSlug: string;
}
