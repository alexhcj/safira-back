import { IsOptional, IsString } from 'class-validator';

export class UpdateOfferDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  upTitle?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  img?: string;
}
