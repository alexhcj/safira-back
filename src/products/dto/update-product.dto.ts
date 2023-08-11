import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsObject()
  readonly price?: {
    price: number;
    discount_price?: number;
  };

  @IsOptional()
  @IsString()
  readonly img?: string;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly subCategory?: string;

  @IsOptional()
  @IsString()
  readonly popularity?: string;

  @IsOptional()
  @IsNumber()
  readonly views?: number;

  @IsOptional()
  @IsNumber()
  readonly rating?: number;

  @IsOptional()
  @IsString()
  readonly company?: string;

  @IsOptional()
  @IsString()
  readonly importCountry?: string;

  @IsOptional()
  @IsString()
  readonly shelfLife?: string;

  @IsOptional()
  @IsString()
  readonly tags?: string[];

  @IsOptional()
  @IsString()
  readonly productTags?: string[];
}
