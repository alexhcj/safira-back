import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly img: string;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly subCategory: string;

  @IsString()
  @IsNotEmpty()
  readonly popularity: string;

  @IsNumber()
  @IsNotEmpty()
  readonly views: number;

  @IsNumber()
  @IsNotEmpty()
  readonly rating: number;

  @IsString()
  @IsNotEmpty()
  readonly company: string;

  @IsString()
  @IsNotEmpty()
  readonly importCountry: string;

  @IsString()
  @IsNotEmpty()
  readonly shelfLife: string;

  @IsString()
  @IsNotEmpty()
  readonly tags: string[];

  @IsString()
  @IsNotEmpty()
  readonly productTags: string[];
}
